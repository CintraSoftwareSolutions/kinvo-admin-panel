import { EmptyState } from '../../../../shared/components/EmptyState'
import { formatRelative } from '../../../../shared/utils/formatDate'
import { humanize } from '../../../../shared/utils/humanize'
import type { PriorityCase } from '../../types/contentModeration.types'
import { SeverityBadge } from '../SeverityBadge'

/** Ordered by severity first, as the endpoint returns them. */
export function PriorityCases({ cases }: { cases: PriorityCase[] }) {
  if (cases.length === 0) {
    return <EmptyState title="No escalations" description="No open High or Medium severity cases." />
  }

  return (
    <div className="grid gap-3">
      {cases.map((item) => (
        <article key={`${item.source}-${item.id}`} className="rounded-[22px] border border-slate-300 bg-slate-50 p-4">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-950">{item.name}</p>
              <p className="mt-2 text-xs text-slate-500">
                {humanize(item.reason)} | {item.mode} | {item.source} | {formatRelative(item.createdAt)}
              </p>
            </div>
            <SeverityBadge severity={item.severity} />
          </div>
          <p className="text-sm leading-6 text-slate-600">{item.description ?? 'No description given.'}</p>
        </article>
      ))}
    </div>
  )
}
