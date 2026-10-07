import { cn } from '../utils/cn'

type RiskBadgeProps = {
  risk: 'Low risk' | 'Medium risk' | 'High risk'
}

export function RiskBadge({ risk }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-semibold',
        risk === 'Low risk' && 'text-emerald-700',
        risk === 'Medium risk' && 'text-orange-700',
        risk === 'High risk' && 'text-red-600',
      )}
    >
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          risk === 'Low risk' && 'bg-emerald-500',
          risk === 'Medium risk' && 'bg-orange-500',
          risk === 'High risk' && 'bg-red-500',
        )}
      />
      {risk}
    </span>
  )
}
