import { cn } from '../../../shared/utils/cn'
import { humanize } from '../../../shared/utils/humanize'
import type { RolloutState } from '../types/subscriptionManagement.types'

type PlanStatusSelectorProps = {
  value: RolloutState
  onChange: (status: RolloutState) => void
}

const statuses: RolloutState[] = ['live', 'promo', 'draft', 'grandfathered']

export function PlanStatusSelector({ value, onChange }: PlanStatusSelectorProps) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">Rollout state</span>
      <div className="grid gap-3 sm:grid-cols-2">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            aria-pressed={status === value}
            onClick={() => onChange(status)}
            className={cn(
              'h-12 rounded-full text-sm font-semibold transition',
              status === value ? 'bg-violet-600 text-white shadow-[0_14px_34px_rgba(111,61,204,0.22)]' : 'bg-white text-slate-500',
            )}
          >
            {humanize(status)}
          </button>
        ))}
      </div>
    </div>
  )
}
