import { EmptyState } from '../../../../shared/components/EmptyState'
import type { AccountEvent } from '../../types/userManagement.types'

export function RecentAccountEvents({ events }: { events: AccountEvent[] }) {
  return (
    <div className="rounded-[22px] border border-slate-300 bg-slate-50 p-4">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Recent account events</p>
      <div className="grid gap-3">
        {events.length === 0 ? <EmptyState title="No recent events" description="Recorded account events appear here." /> : null}
        {events.map((item, index) => (
          <div key={`${item.name}-${item.event}-${index}`} className="rounded-2xl border border-slate-300 bg-white p-3">
            <p className="text-sm font-semibold text-slate-950">{item.name}</p>
            <p className="mt-1 text-xs text-slate-500">{item.event}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
