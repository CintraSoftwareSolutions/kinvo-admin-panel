import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiSend } from '../../../api/client'
import { useAuth } from './useAuth'

export type Guardrail = {
  key: string
  title: string
  description: string
  enabled: boolean
  updated_at: string
}

export const readOnlyGuardrailKey = 'admin.read_only'
const guardrailsKey = ['admin', 'guardrails'] as const

export function useGuardrails() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: guardrailsKey,
    enabled: isAuthenticated,
    queryFn: ({ signal }) => apiGet<{ guardrails: Guardrail[] }>('/admin/guardrails', undefined, signal),
    select: (data) => data.guardrails,
    // Another operator can switch read-only mode on; notice within a minute.
    refetchInterval: 60_000,
  })
}

/** True while admin.read_only is on: every mutating admin endpoint answers 403. */
export function useReadOnly() {
  const { data } = useGuardrails()
  return Boolean(data?.find((guardrail) => guardrail.key === readOnlyGuardrailKey)?.enabled)
}

export function useToggleGuardrail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      apiSend<unknown>('PATCH', `/admin/guardrails/${encodeURIComponent(key)}`, { enabled }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: guardrailsKey }),
  })
}
