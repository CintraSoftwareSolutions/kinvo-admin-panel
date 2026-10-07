import { appIcons } from '../../../shared/icons/appIcons'
import type { VenueSuggestion } from '../types/dateSuggestions.types'

type VenueCardProps = {
  venue: VenueSuggestion
  onMoveStatus: (venue: VenueSuggestion) => void
}

const MoveStatusIcon = appIcons.adminOperations.moveStatus

export function VenueCard({ venue, onMoveStatus }: VenueCardProps) {
  return (
    <article className="min-h-[134px] rounded-[22px] border border-slate-300 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-slate-950">{venue.name}</p>
          <p className="mt-2 text-xs text-slate-500">{venue.category}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">{venue.status}</span>
      </div>
      <button
        type="button"
        onClick={() => onMoveStatus(venue)}
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-violet-100 px-4 text-sm font-semibold text-violet-700 transition hover:bg-violet-200"
      >
        <MoveStatusIcon className="h-4 w-4" aria-hidden="true" />
        Move status
      </button>
    </article>
  )
}
