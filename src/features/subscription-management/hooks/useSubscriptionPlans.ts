import { useMemo, useState } from 'react'
import { subscriptionPlansMock } from '../data/subscriptionPlans.mock'
import type { SubscriptionPlan } from '../types/subscriptionManagement.types'

function matchesPlan(plan: SubscriptionPlan, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return [plan.name, plan.billingCycle, plan.status, plan.note, plan.rolloutNote].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  )
}

export function useSubscriptionPlans(query: string) {
  const [plans, setPlans] = useState(subscriptionPlansMock)
  const filteredPlans = useMemo(() => plans.filter((plan) => matchesPlan(plan, query)), [plans, query])

  function updatePlan(updatedPlan: SubscriptionPlan) {
    setPlans((currentPlans) => currentPlans.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan)))
  }

  return {
    plans: filteredPlans,
    updatePlan,
  }
}
