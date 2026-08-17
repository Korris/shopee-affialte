import { apiFactory } from '../api-factory'
import type { AffiliateLinkHistoryItem, GenerateLinkResponse } from './types'

// Generate link affiliate từ link sản phẩm Shopee
export async function generateAffiliateLink(url: string, subId?: string) {
  const res = await apiFactory.post<GenerateLinkResponse>('/api/affiliate/generate', { url, subId })
  return res
}

// Lấy lịch sử các link đã generate
export async function getAffiliateLinkHistory(page = 1, limit = 20) {
  const res = await apiFactory.getMany<AffiliateLinkHistoryItem>(`/api/affiliate/history?page=${page}&limit=${limit}`)
  return res
}
