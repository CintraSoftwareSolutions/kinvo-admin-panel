import { useState } from 'react'
import { EmptyState } from '../../../shared/components/EmptyState'
import { appIcons } from '../../../shared/icons/appIcons'
import type { VenueSuggestion } from '../types/dateSuggestions.types'
import { VenueCard } from './VenueCard'
import { VenueStatusModal } from './VenueStatusModal'

type VenueCurationListProps = {
  venues: VenueSuggestion[]
  onUpdateStatus: (venueId: string, status: VenueSuggestion['status']) => void
}

const PreviousIcon = appIcons.table.previous
const NextIcon = appIcons.table.next

export function VenueCurationList({ venues, onUpdateStatus }: VenueCurationListProps) {
  const [selectedVenue, setSelectedVenue] = useState<VenueSuggestion | null>(null)
  const visibleVenues = venues.slice(0, 10)

  return (
    <>
      {visibleVenues.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid min-w-0 max-w-full gap-3 min-[900px]:grid-cols-2">
            {visibleVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} onMoveStatus={setSelectedVenue} />
            ))}
          </div>
          <div className="mt-5 grid min-w-0 gap-3 border-t border-slate-300 px-0 py-3 text-sm text-slate-500 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-4">
            <button
              type="button"
              disabled
              className="inline-flex h-9 w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 font-semibold text-slate-400"
            >
              <PreviousIcon className="h-4 w-4" />
              Previous
            </button>
            <div className="flex items-center justify-center gap-2">
              <span>1-2 of 4 venues</span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 font-semibold text-white">
                1
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 font-semibold text-slate-500">
                2
              </span>
            </div>
            <button
              type="button"
              className="inline-flex h-9 w-fit items-center gap-2 justify-self-start rounded-full border border-slate-200 bg-white px-4 font-semibold text-slate-500 sm:justify-self-end"
            >
              Next
              <NextIcon className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
      <VenueStatusModal venue={selectedVenue} onClose={() => setSelectedVenue(null)} onSave={onUpdateStatus} />
    </>
  )
}
