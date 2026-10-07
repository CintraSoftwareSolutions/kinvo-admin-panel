import { cn } from '../../../shared/utils/cn'
import type { ReportSeverity } from '../types/contentModeration.types'

type SeverityBadgeProps = {
  severity: ReportSeverity
}

const severityStyles: Record<ReportSeverity, string> = {
  High: 'bg-rose-100 text-red-600',
  Medium: 'bg-orange-100 text-orange-700',
  Low: 'bg-blue-100 text-blue-600',
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span className={cn('inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold', severityStyles[severity])}>
      {severity}
    </span>
  )
}
