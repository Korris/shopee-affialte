// server/api/affiliate/history.get.ts
// API lấy lịch sử các link affiliate đã generate (mới nhất trước)

import { handleApiError } from '~~/server/utils/error-handler'
import { useCollections } from '~~/server/utils/use-database'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const page = Math.max(1, parseInt(String(query.page || '1'), 10) || 1)
        const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || '20'), 10) || 20))

        const { affiliateLinksCollection } = await useCollections()

        const [items, total] = await Promise.all([
            affiliateLinksCollection
                .find({})
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray(),
            affiliateLinksCollection.countDocuments({}),
        ])

        return {
            success: true,
            data: items,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }

    } catch (error) {
        handleApiError(error, 'Không thể tải lịch sử link affiliate')
    }
})
