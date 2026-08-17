// server/utils/shopee-affiliate-client.ts
// Client gọi Shopee Affiliate Open API (GraphQL) để generate short link affiliate
// Docs: https://affiliate.shopee.vn -> Công cụ -> API (cần AppId + Secret)

import { createHash } from 'node:crypto'
import type { AffiliateLinkMethod } from '~~/server/models'

const SHOPEE_AFFILIATE_API_URL = 'https://open-api.affiliate.shopee.vn/graphql'

export interface GenerateLinkResult {
  affiliateUrl: string
  method: AffiliateLinkMethod
}

// Ký request theo chuẩn Shopee: SHA256(AppId + Timestamp + Payload + Secret)
function buildAuthHeader(appId: string, secret: string, payload: string): string {
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = createHash('sha256')
    .update(`${appId}${timestamp}${payload}${secret}`)
    .digest('hex')
  return `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`
}

// Gọi mutation generateShortLink của Shopee Affiliate Open API
export async function generateShortLinkViaOpenApi(
  originUrl: string,
  subId?: string
): Promise<string> {
  const config = useRuntimeConfig()

  const subIdsLiteral = subId ? `["${subId.replace(/[^a-zA-Z0-9_]/g, '')}"]` : '[]'
  const query = `mutation{generateShortLink(input:{originUrl:${JSON.stringify(originUrl)},subIds:${subIdsLiteral}}){shortLink}}`
  const payload = JSON.stringify({ query })

  const res = await fetch(SHOPEE_AFFILIATE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': buildAuthHeader(config.shopeeAppId, config.shopeeAppSecret, payload),
    },
    body: payload,
  })

  // Đọc raw body trước để log được cả khi Shopee trả về non-JSON
  const rawBody = await res.text()

  if (!res.ok) {
    console.error(`[Shopee API] HTTP ${res.status}:`, rawBody)
    throw createError({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      data: {
        message: `Shopee API trả về lỗi HTTP ${res.status}`,
        detail: rawBody.slice(0, 1000),
      }
    })
  }

  let json: any
  try {
    json = JSON.parse(rawBody)
  } catch {
    console.error('[Shopee API] Response không phải JSON:', rawBody)
    throw createError({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      data: { message: 'Shopee API trả về dữ liệu không hợp lệ', detail: rawBody.slice(0, 1000) }
    })
  }

  if (json.errors?.length) {
    // Shopee GraphQL error: message + extensions.code (vd: 10020 = invalid signature, 10010 = invalid appId)
    console.error('[Shopee API] GraphQL errors:', JSON.stringify(json.errors))
    const firstError = json.errors[0]
    throw createError({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      data: {
        message: `Shopee API lỗi: ${firstError?.message || 'Unknown error'}`,
        detail: json.errors,
      }
    })
  }

  const shortLink = json.data?.generateShortLink?.shortLink
  if (!shortLink) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      data: { message: 'Shopee API không trả về short link' }
    })
  }

  return shortLink
}

// Fallback: build link redirect thủ công khi chưa có API credentials
// Dạng: https://shope.ee/an_redir?origin_link={url}&affiliate_id={id}&sub_id={sub}
export function buildManualRedirectLink(originUrl: string, affiliateId: string, subId?: string): string {
  const params = new URLSearchParams({
    origin_link: originUrl,
    affiliate_id: affiliateId,
  })
  if (subId) params.set('sub_id', subId)
  return `https://shope.ee/an_redir?${params.toString()}`
}

// Generate link affiliate: ưu tiên Open API, fallback về manual redirect
export async function generateAffiliateLink(originUrl: string, subId?: string): Promise<GenerateLinkResult> {
  const config = useRuntimeConfig()

  if (config.shopeeAppId && config.shopeeAppSecret) {
    const affiliateUrl = await generateShortLinkViaOpenApi(originUrl, subId)
    return { affiliateUrl, method: 'open-api' }
  }

  if (config.shopeeAffiliateId) {
    return {
      affiliateUrl: buildManualRedirectLink(originUrl, config.shopeeAffiliateId, subId),
      method: 'manual-redirect',
    }
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    data: {
      message: 'Chưa cấu hình Shopee Affiliate. Cần set SHOPEE_APP_ID + SHOPEE_APP_SECRET (hoặc SHOPEE_AFFILIATE_ID) trong file .env'
    }
  })
}
