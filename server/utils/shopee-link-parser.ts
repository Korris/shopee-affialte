// server/utils/shopee-link-parser.ts
// Validate / chuẩn hóa link sản phẩm Shopee, resolve short link, trích shopId & itemId

// Các domain Shopee đầy đủ (theo thị trường)
const SHOPEE_HOSTS = [
  'shopee.vn', 'shopee.com', 'shopee.sg', 'shopee.co.id', 'shopee.co.th',
  'shopee.com.my', 'shopee.ph', 'shopee.tw', 'shopee.com.br', 'shopee.com.mx',
]

// Các domain short link / redirect của Shopee
const SHOPEE_SHORT_HOSTS = ['shope.ee', 's.shopee.vn', 'shp.ee', 'vn.shp.ee']

// Query params tracking cần loại bỏ để lấy link gốc "sạch"
const TRACKING_PARAM_PREFIXES = ['utm_', 'af_', 'pid', 'is_from_login', 'sp_atk', 'xptdk', 'publish_id', 'uls_trackid']

function getHost(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return null
  }
}

export function isShopeeProductHost(url: string): boolean {
  const host = getHost(url)
  return !!host && SHOPEE_HOSTS.some(h => host === h || host.endsWith(`.${h}`))
}

export function isShopeeShortHost(url: string): boolean {
  const host = getHost(url)
  return !!host && SHOPEE_SHORT_HOSTS.includes(host)
}

export function isShopeeUrl(url: string): boolean {
  return isShopeeProductHost(url) || isShopeeShortHost(url)
}

// Resolve short link (shope.ee/xxx, s.shopee.vn/xxx) bằng cách follow redirect thủ công
export async function resolveShortLink(url: string, maxRedirects = 5): Promise<string> {
  let current = url
  for (let i = 0; i < maxRedirects; i++) {
    if (isShopeeProductHost(current)) return current

    const res = await fetch(current, {
      method: 'GET',
      redirect: 'manual',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    })
    const location = res.headers.get('location')
    if (!location) return current

    // Location có thể là relative path
    current = new URL(location, current).toString()
  }
  return current
}

// Bỏ các tracking params để có link gốc sạch cho affiliate API
export function normalizeShopeeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    const params = parsed.searchParams
    const keysToDelete: string[] = []

    params.forEach((_value, key) => {
      const lowerKey = key.toLowerCase()
      if (TRACKING_PARAM_PREFIXES.some(p => lowerKey === p || lowerKey.startsWith(p))) {
        keysToDelete.push(key)
      }
    })
    keysToDelete.forEach(key => params.delete(key))

    parsed.hash = ''
    return parsed.toString()
  } catch {
    return url
  }
}

// Trích shopId & itemId từ URL sản phẩm
// Hỗ trợ 2 dạng: /ten-san-pham-i.{shopId}.{itemId}  và  /product/{shopId}/{itemId}
export function extractProductIds(url: string): { shopId?: string; itemId?: string } {
  try {
    const pathname = new URL(url).pathname

    const classicMatch = pathname.match(/-i\.(\d+)\.(\d+)/)
    if (classicMatch) return { shopId: classicMatch[1], itemId: classicMatch[2] }

    const productMatch = pathname.match(/\/product\/(\d+)\/(\d+)/)
    if (productMatch) return { shopId: productMatch[1], itemId: productMatch[2] }

    return {}
  } catch {
    return {}
  }
}
