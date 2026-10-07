import { cn } from '../utils/cn'

type StatusBadgeProps = {
  status: string
}

const statusStyles: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-800',
  Premium: 'bg-orange-100 text-orange-700',
  Inactive: 'bg-slate-100 text-slate-500',
  Flagged: 'bg-rose-100 text-rose-700',
  Paid: 'bg-emerald-100 text-emerald-800',
  Pending: 'bg-orange-100 text-orange-700',
  Failed: 'bg-rose-100 text-rose-700',
  Healthy: 'text-emerald-700',
  Watch: 'text-orange-700',
  Escalated: 'text-red-600',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const dotOnly = status === 'Healthy' || status === 'Watch' || status === 'Escalated'
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-2 rounded-full text-xs font-semibold',
        dotOnly ? statusStyles[status] : 'px-3 py-1',
        !dotOnly && (statusStyles[status] ?? 'bg-slate-100 text-slate-600'),
      )}
    >
      {dotOnly ? (
        <span
          className={cn(
            'h-2.5 w-2.5 rounded-full',
            status === 'Healthy' && 'bg-emerald-500',
            status === 'Watch' && 'bg-orange-500',
            status === 'Escalated' && 'bg-red-500',
          )}
        />
      ) : null}
      {status}
    </span>
  )
}
