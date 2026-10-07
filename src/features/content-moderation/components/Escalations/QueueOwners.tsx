import { EmptyState } from '../../../../shared/components/EmptyState'
import type { QueueOwner } from '../../types/contentModeration.types'

export function QueueOwners({ owners }: { owners: QueueOwner[] }) {
  if (owners.length === 0) {
    return <EmptyState title="Nobody owns open work" description="Cases appear here once a moderator claims them." />
  }

  return (
    <div className="grid gap-3">
      {owners.map((owner) => (
        <article
          key={owner.id}
          className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-300 bg-slate-50 p-4"
        >
          <div>
            <p className="font-semibold text-slate-950">{owner.name}</p>
            {owner.location || owner.lane ? (
              <p className="mt-2 text-xs text-slate-500">{[owner.location, owner.lane].filter(Boolean).join(' | ')}</p>
            ) : null}
          </div>
          {owner.badge ? (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">{owner.badge}</span>
          ) : null}
        </article>
      ))}
    </div>
  )
}
