import { cn } from '../../../shared/utils/cn'
import type { SubscriptionPlan } from '../types/subscriptionManagement.types'

type PlanCardProps = {
  plan: SubscriptionPlan
  selected: boolean
  onSelect: () => void
}

export function PlanCard({ plan, selected, onSelect }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'min-h-[118px] w-full rounded-[22px] border bg-slate-50 p-4 text-left transition',
        selected ? 'border-violet-600 bg-violet-50' : 'border-slate-300 hover:border-violet-300',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-slate-950">
            {plan.name} | {plan.billingCycle}
          </p>
          <p className="mt-4 text-lg font-semibold text-slate-950">${plan.price}</p>
          <p className="mt-2 text-xs font-semibold text-slate-500">{plan.note}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">{plan.status}</span>
      </div>
    </button>
  )
}
