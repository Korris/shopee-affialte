// Kiểu response chung cho toàn bộ API

export interface SingleRes<T> {
  success: boolean
  data: T
  message?: string
}

export interface PagingRes<T> {
  success: boolean
  data: T[]
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
