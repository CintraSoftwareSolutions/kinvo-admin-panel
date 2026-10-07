import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiSend } from '../../../api/client'
import type { PlanPatch, PriceVersion, SubscriptionPlan } from '../types/subscriptionManagement.types'

const planKeys = {
  all: ['admin', 'subscription-products'] as const,
  prices: (id: string) => ['admin', 'subscription-products', id, 'prices'] as const,
}

function matchesPlan(plan: SubscriptionPlan, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return [plan.name, plan.slug, plan.tier, plan.billing_cycle, plan.rollout_state, plan.rollout_note ?? ''].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  )
}

/** GET /admin/subscription-products — a short, unpaginated catalogue, so search is local. */
export function useSubscriptionPlans(query: string) {
  const plans = useQuery({
    queryKey: planKeys.all,
    queryFn: ({ signal }) => apiGet<{ plans: SubscriptionPlan[] }>('/admin/subscription-products', undefined, signal),
    select: (data) => data.plans,
  })

  return { ...plans, plans: (plans.data ?? []).filter((plan) => matchesPlan(plan, query)) }
}

export function usePriceHistory(productId: string) {
  return useQuery({
    queryKey: planKeys.prices(productId),
    queryFn: ({ signal }) =>
      apiGet<{ versions: PriceVersion[] }>(`/admin/subscription-products/${productId}/prices`, undefined, signal),
    select: (data) => data.versions,
  })
}

export function useUpdatePlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: PlanPatch }) =>
      apiSend<unknown>('PATCH', `/admin/subscription-products/${id}`, patch),
    onSettled: () => queryClient.invalidateQueries({ queryKey: planKeys.all }),
  })
}

/** A price change creates a new version (201); re-sending the open amount answers 409. */
export function useCreatePriceVersion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, amountMinor, currency, note }: { id: string; amountMinor: number; currency: string; note?: string }) =>
      apiSend<unknown>('POST', `/admin/subscription-products/${id}/prices`, {
        amount_minor: amountMinor,
        currency,
        note: note || undefined,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: planKeys.all }),
  })
}
