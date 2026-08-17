// server/models/index.ts
// MongoDB Models & TypeScript interfaces

import { ObjectId } from 'mongodb'

// Base interface cho tất cả documents
export interface BaseDocument {
    _id?: ObjectId
    createdAt: Date
    updatedAt: Date
}

// Phương thức đã dùng để generate link affiliate
export type AffiliateLinkMethod = 'open-api' | 'manual-redirect'

// AffiliateLink Model — lịch sử các link đã generate
export interface AffiliateLink extends BaseDocument {
    originUrl: string        // Link sản phẩm gốc (đã chuẩn hóa, bỏ tracking params)
    inputUrl: string         // Link user paste vào (nguyên bản)
    affiliateUrl: string     // Link affiliate đã generate
    method: AffiliateLinkMethod
    subId?: string           // Sub ID để tracking chiến dịch (nếu có)
    shopId?: string          // Shop ID trích từ URL (nếu parse được)
    itemId?: string          // Item ID trích từ URL (nếu parse được)
}

export const COLLECTIONS = {
    AFFILIATE_LINKS: 'affiliate_links',
} as const
