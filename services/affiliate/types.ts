// Kiểu dữ liệu cho tính năng affiliate link

export type AffiliateLinkMethod = 'open-api' | 'manual-redirect'

// Kết quả generate link từ API
export interface GenerateLinkResponse {
  originUrl: string
  affiliateUrl: string
  method: AffiliateLinkMethod
  shopId?: string
  itemId?: string
  historySaved: boolean
}

// 1 record trong lịch sử link
export interface AffiliateLinkHistoryItem {
  _id: string
  originUrl: string
  inputUrl: string
  affiliateUrl: string
  method: AffiliateLinkMethod
  subId?: string
  shopId?: string
  itemId?: string
  createdAt: string
  updatedAt: string
}
