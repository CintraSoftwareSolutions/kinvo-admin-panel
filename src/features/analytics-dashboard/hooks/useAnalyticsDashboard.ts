import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../api/client'
import type { AnalyticsDashboard } from '../types/analyticsDashboard.types'

/**
 * GET /admin/analytics. Nothing is cached server-side, so it is slow: fetch once
 * per visit, never poll, and refetch only when the operator asks.
 */
export function useAnalyticsDashboard() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: ({ signal }) => apiGet<AnalyticsDashboard>('/admin/analytics', undefined, signal),
    staleTime: 5 * 60_000,
  })
}

export function matchesQuery(values: Array<string | number>, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return values.some((value) => String(value).toLowerCase().includes(normalizedQuery))
}
