import { cn } from '../../../../shared/utils/cn'
import { userSnapshotMock } from '../../data/userSnapshot.mock'

export function AttentionQueue() {
  return (
    <div className="rounded-[22px] border border-slate-300 bg-slate-50 p-4">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Attention queue</p>
      <div className="grid gap-3">
        {userSnapshotMock.attentionQueue.map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-300 bg-white p-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">{item.name}</p>
              <p className="text-xs text-slate-500">{item.detail}</p>
            </div>
            <span className={cn('text-xs font-semibold', item.risk === 'High' ? 'text-red-600' : 'text-orange-700')}>
              {item.risk}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
