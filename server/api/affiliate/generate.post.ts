// server/api/affiliate/generate.post.ts
// API generate link affiliate từ link sản phẩm Shopee user paste vào

import { AffiliateLink } from '~~/server/models'
import { handleApiError, validateRequiredFields } from '~~/server/utils/error-handler'
import { useCollections } from '~~/server/utils/use-database'
import {
    extractProductIds,
    isShopeeProductHost,
    isShopeeShortHost,
    isShopeeUrl,
    normalizeShopeeUrl,
    resolveShortLink,
} from '~~/server/utils/shopee-link-parser'
import { generateAffiliateLink } from '~~/server/utils/shopee-affiliate-client'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        validateRequiredFields(body, ['url'])

        const inputUrl: string = String(body.url).trim()
        const subId: string | undefined = body.subId ? String(body.subId).trim() : undefined

        if (!isShopeeUrl(inputUrl)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                data: { message: 'Link không hợp lệ. Vui lòng paste link sản phẩm Shopee (shopee.vn, shope.ee, s.shopee.vn...)' }
            })
        }

        // Short link -> resolve về link sản phẩm đầy đủ
        let fullUrl = inputUrl
        if (isShopeeShortHost(inputUrl)) {
            fullUrl = await resolveShortLink(inputUrl)
            if (!isShopeeProductHost(fullUrl)) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Bad Request',
                    data: { message: 'Không resolve được short link về trang sản phẩm Shopee' }
                })
            }
        }

        // Chuẩn hóa link (bỏ tracking params) rồi generate
        const originUrl = normalizeShopeeUrl(fullUrl)
        const { shopId, itemId } = extractProductIds(originUrl)
        const { affiliateUrl, method } = await generateAffiliateLink(originUrl, subId)

        // Lưu lịch sử (fail-soft: DB lỗi vẫn trả link cho user)
        let saved: AffiliateLink | null = null
        try {
            const { affiliateLinksCollection } = await useCollections()
            const newLink: AffiliateLink = {
                originUrl,
                inputUrl,
                affiliateUrl,
                method,
                subId,
                shopId,
                itemId,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            const result = await affiliateLinksCollection.insertOne(newLink)
            saved = { ...newLink, _id: result.insertedId }
        } catch (dbError) {
            console.error('Không lưu được lịch sử link (DB offline?):', dbError)
        }

        return {
            success: true,
            data: {
                originUrl,
                affiliateUrl,
                method,
                shopId,
                itemId,
                historySaved: !!saved,
            },
            message: 'Generate link affiliate thành công'
        }

    } catch (error) {
        handleApiError(error, 'Không thể generate link affiliate')
    }
})
