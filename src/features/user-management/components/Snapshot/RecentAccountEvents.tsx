import { userSnapshotMock } from '../../data/userSnapshot.mock'

export function RecentAccountEvents() {
  return (
    <div className="rounded-[22px] border border-slate-300 bg-slate-50 p-4">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Recent account events</p>
      <div className="grid gap-3">
        {userSnapshotMock.recentAccountEvents.map((item) => (
          <div key={`${item.name}-${item.event}`} className="rounded-2xl border border-slate-300 bg-white p-3">
            <p className="text-sm font-semibold text-slate-950">{item.name}</p>
            <p className="mt-1 text-xs text-slate-500">{item.event}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
