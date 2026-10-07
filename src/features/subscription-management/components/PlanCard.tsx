import { cn } from '../../../shared/utils/cn'
import { formatMinor } from '../../../shared/utils/formatCurrency'
import { humanize } from '../../../shared/utils/humanize'
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
        !plan.is_active && 'opacity-75',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-slate-950">
            {plan.name}
            {/* Product names usually already carry the cycle; only add it when they do not. */}
            {plan.name.toLowerCase().includes(plan.billing_cycle.toLowerCase()) ? null : ` | ${humanize(plan.billing_cycle)}`}
          </p>
          <p className="mt-4 text-lg font-semibold text-slate-950">
            {plan.price ? formatMinor(plan.price.amount_minor, plan.price.currency) : 'No open price'}
          </p>
          <p className="mt-2 text-xs font-semibold text-slate-500">
            {plan.active_subscribers} subscribers · MRR {formatMinor(plan.mrr_minor, plan.currency)}
          </p>
        </div>
        <span className="grid shrink-0 justify-items-end gap-1">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">{humanize(plan.rollout_state)}</span>
          <span className={cn('text-[11px] font-semibold', plan.is_active ? 'text-emerald-700' : 'text-slate-400')}>
            {plan.is_active ? 'Visible in app' : 'Hidden from app'}
          </span>
        </span>
      </div>
    </button>
  )
}
