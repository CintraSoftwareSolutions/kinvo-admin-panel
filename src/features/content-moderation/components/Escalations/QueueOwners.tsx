import { queueOwnersMock } from '../../data/escalations.mock'

export function QueueOwners() {
  return (
    <div className="grid gap-3">
      {queueOwnersMock.map((owner) => (
        <article
          key={owner.id}
          className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-300 bg-slate-50 p-4"
        >
          <div>
            <p className="font-semibold text-slate-950">{owner.name}</p>
            <p className="mt-2 text-xs text-slate-500">
              {owner.location} | {owner.lane}
            </p>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">{owner.badge}</span>
        </article>
      ))}
    </div>
  )
}
