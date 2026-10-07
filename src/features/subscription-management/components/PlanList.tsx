import type { SubscriptionPlan } from '../types/subscriptionManagement.types'
import { PlanCard } from './PlanCard'

type PlanListProps = {
  plans: SubscriptionPlan[]
  selectedPlanId: string
  onSelectPlan: (plan: SubscriptionPlan) => void
}

export function PlanList({ plans, selectedPlanId, onSelectPlan }: PlanListProps) {
  return (
    <div className="grid gap-3">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} selected={plan.id === selectedPlanId} onSelect={() => onSelectPlan(plan)} />
      ))}
    </div>
  )
}
