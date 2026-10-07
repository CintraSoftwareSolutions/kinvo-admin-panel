import { priorityCasesMock } from '../../data/escalations.mock'
import { SeverityBadge } from '../SeverityBadge'

export function PriorityCases() {
  return (
    <div className="grid gap-3">
      {priorityCasesMock.map((item) => (
        <article key={item.id} className="rounded-[22px] border border-slate-300 bg-slate-50 p-4">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-950">{item.name}</p>
              <p className="mt-2 text-xs text-slate-500">
                {item.reason} | {item.mode}
              </p>
            </div>
            <SeverityBadge severity={item.severity} />
          </div>
          <p className="text-sm leading-6 text-slate-600">{item.description}</p>
        </article>
      ))}
    </div>
  )
}
