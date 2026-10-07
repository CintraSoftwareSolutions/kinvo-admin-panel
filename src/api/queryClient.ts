import { MutationCache, QueryClient } from '@tanstack/react-query'
import { isApiError } from './client'

// 4xx answers are decisions, not blips: retrying a 403 or a 409 only delays the message.
function shouldRetry(failureCount: number, error: unknown) {
  if (isApiError(error) && error.status >= 400 && error.status < 500) return false
  return failureCount < 2
}

export const queryClient: QueryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      // A refused change may mean read-only mode was just switched on elsewhere:
      // re-check the guardrails so the banner and disabled controls catch up.
      if (isApiError(error) && error.status === 403) {
        void queryClient.invalidateQueries({ queryKey: ['admin', 'guardrails'] })
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
