import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiSend, isApiError } from '../../../api/client'
import type { ModerationInsights, ModerationReport, PriorityCase } from '../types/contentModeration.types'

export const moderationKeys = {
  all: ['admin', 'moderation'] as const,
  queue: ['admin', 'moderation', 'queue'] as const,
  escalations: ['admin', 'moderation', 'escalations'] as const,
  insights: ['admin', 'moderation', 'insights'] as const,
  verification: ['admin', 'moderation', 'verification'] as const,
}

export function useEscalations() {
  return useQuery({
    queryKey: moderationKeys.escalations,
    queryFn: ({ signal }) => apiGet<{ cases: PriorityCase[] }>('/admin/moderation/escalations', { limit: 50 }, signal),
    select: (data) => data.cases,
  })
}

export function useModerationInsights() {
  return useQuery({
    queryKey: moderationKeys.insights,
    queryFn: ({ signal }) => apiGet<ModerationInsights>('/admin/moderation/insights', undefined, signal),
  })
}

export type Resolution = 'under_review' | 'actioned' | 'dismissed'

/** A second review answers 409 rather than overwriting — someone else got there first. */
export function isAlreadyReviewed(error: unknown) {
  return isApiError(error) && (error.status === 409 || error.code === 'CONFLICT')
}

/**
 * Resolving runs on the pre-existing endpoints, which own the second-review
 * check, badge recomputation, audit entry and notification.
 */
export function useResolveCase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ item, status, note }: { item: Pick<ModerationReport, 'id' | 'source'>; status: Resolution; note?: string }) =>
      item.source === 'report'
        ? apiSend<unknown>('PATCH', `/reports/${item.id}`, { status, resolution_note: note || undefined })
        : apiSend<unknown>('PATCH', `/moderation/flags/${item.id}`, { status }),
    // Refresh on 409 as well: the case changed under us.
    onSettled: () => queryClient.invalidateQueries({ queryKey: moderationKeys.all }),
  })
}

export function useAssignFlag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ flagId, assigneeId }: { flagId: string; assigneeId: string | null }) =>
      apiSend<unknown>('PATCH', `/admin/moderation/flags/${flagId}/assignee`, { assignee_id: assigneeId }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: moderationKeys.all }),
  })
}

export function useReviewVerification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, approve, reason }: { id: string; approve: boolean; reason?: string }) =>
      apiSend<unknown>('POST', `/verification/${id}/review`, { approve, reason: reason || undefined }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: moderationKeys.all }),
  })
}
