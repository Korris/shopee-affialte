// server/utils/error-handler.ts
// Utility functions để xử lý errors một cách type-safe

export interface ApiError extends Error {
  statusCode?: number
  statusMessage?: string
  data?: any
}

export function isHttpError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'statusCode' in error
}

export function handleApiError(error: unknown, defaultMessage: string) {
  if (isHttpError(error)) {
    throw error
  }

  console.error('API Error:', error)
  throw createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    data: {
      message: defaultMessage
    }
  })
}

export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]) {
  const errors: Record<string, string> = {}
  const missingFields: string[] = []

  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors[field] = `${field} là bắt buộc`
      missingFields.push(field)
    }
  }

  if (missingFields.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Thiếu thông tin bắt buộc',
        errors
      }
    })
  }
}
