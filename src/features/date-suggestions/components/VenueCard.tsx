import { appIcons } from '../../../shared/icons/appIcons'
import { cn } from '../../../shared/utils/cn'
import { humanize } from '../../../shared/utils/humanize'
import type { VenueSuggestion } from '../types/dateSuggestions.types'

type VenueCardProps = {
  venue: VenueSuggestion
  onEdit: (venue: VenueSuggestion) => void
}

const MoveStatusIcon = appIcons.adminOperations.moveStatus

function Flag({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        on ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500',
      )}
    >
      {on ? label : `Not ${label.toLowerCase()}`}
    </span>
  )
}

export function VenueCard({ venue, onEdit }: VenueCardProps) {
  const place = [venue.city, venue.country].filter(Boolean).join(', ')

  return (
    <article className={cn('min-h-[134px] rounded-[22px] border border-slate-300 bg-slate-50 p-4', !venue.is_active && 'opacity-70')}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-slate-950">{venue.name}</p>
          <p className="mt-2 text-xs text-slate-500">
            {humanize(venue.category)}
            {place ? ` · ${place}` : ''}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">{venue.status}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Flag on={venue.is_reviewed} label="Reviewed" />
        <Flag on={venue.is_featured} label="Featured" />
        <Flag on={venue.is_active} label="Active" />
      </div>
      {venue.modes.length > 0 ? <p className="mt-2 text-xs text-slate-400">{venue.modes.map(humanize).join(' · ')}</p> : null}
      <button
        type="button"
        onClick={() => onEdit(venue)}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-violet-100 px-4 text-sm font-semibold text-violet-700 transition hover:bg-violet-200"
      >
        <MoveStatusIcon className="h-4 w-4" aria-hidden="true" />
        Edit & curate
      </button>
    </article>
  )
}
