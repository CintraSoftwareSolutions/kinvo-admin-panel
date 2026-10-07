import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../../../shared/components/EmptyState'
import type { SubscriptionPlan } from '../types/subscriptionManagement.types'
import { PlanEditorForm } from './PlanEditorForm'
import { PlanList } from './PlanList'

type MembershipEditorProps = {
  plans: SubscriptionPlan[]
  onSavePlan: (plan: SubscriptionPlan) => void
}

export function MembershipEditor({ plans, onSavePlan }: MembershipEditorProps) {
  const [selectedPlanId, setSelectedPlanId] = useState(() => plans[0]?.id ?? '')

  useEffect(() => {
    if (!plans.some((plan) => plan.id === selectedPlanId)) {
      setSelectedPlanId(plans[0]?.id ?? '')
    }
  }, [plans, selectedPlanId])

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? plans[0],
    [plans, selectedPlanId],
  )

  if (!selectedPlan) {
    return <EmptyState />
  }

  return (
    <div className="grid min-w-0 max-w-full gap-4 min-[1180px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.05fr)]">
      <PlanList plans={plans} selectedPlanId={selectedPlan.id} onSelectPlan={(plan) => setSelectedPlanId(plan.id)} />
      <PlanEditorForm plan={selectedPlan} onSave={onSavePlan} />
    </div>
  )
}
