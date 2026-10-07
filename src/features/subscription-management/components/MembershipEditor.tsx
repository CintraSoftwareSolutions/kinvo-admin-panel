import { useState } from 'react'
import { EmptyState } from '../../../shared/components/EmptyState'
import type { SubscriptionPlan } from '../types/subscriptionManagement.types'
import { PlanEditorForm } from './PlanEditorForm'
import { PlanList } from './PlanList'

type MembershipEditorProps = {
  plans: SubscriptionPlan[]
}

export function MembershipEditor({ plans }: MembershipEditorProps) {
  const [chosenPlanId, setChosenPlanId] = useState<string | null>(null)
  // Fall back to the first plan when the chosen one is filtered out by search.
  const selectedPlan = plans.find((plan) => plan.id === chosenPlanId) ?? plans[0]

  if (!selectedPlan) {
    return <EmptyState title="No products match" description="Try a different search." />
  }

  return (
    <div className="grid min-w-0 max-w-full gap-4 min-[1180px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.05fr)]">
      <PlanList plans={plans} selectedPlanId={selectedPlan.id} onSelectPlan={(plan) => setChosenPlanId(plan.id)} />
      <PlanEditorForm key={selectedPlan.id} plan={selectedPlan} />
    </div>
  )
}
