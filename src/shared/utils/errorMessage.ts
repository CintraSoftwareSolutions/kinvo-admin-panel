import { isApiError } from '../../api/client'

export function getErrorMessage(error: unknown) {
  if (isApiError(error)) return error.message
  if (error instanceof Error && error.message) return error.message
  return 'Something went wrong. Please try again.'
}
