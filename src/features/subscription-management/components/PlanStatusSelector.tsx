import { cn } from '../../../shared/utils/cn'
import type { PlanStatus } from '../types/subscriptionManagement.types'

type PlanStatusSelectorProps = {
  value: PlanStatus
  onChange: (status: PlanStatus) => void
}

const statuses: PlanStatus[] = ['Live', 'Promo', 'Draft', 'Grandfathered']

export function PlanStatusSelector({ value, onChange }: PlanStatusSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {statuses.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(status)}
          className={cn(
            'h-12 rounded-full text-sm font-semibold transition',
            status === value ? 'bg-violet-600 text-white shadow-[0_14px_34px_rgba(111,61,204,0.22)]' : 'bg-white text-slate-500',
          )}
        >
          {status}
        </button>
      ))}
    </div>
  )
}
