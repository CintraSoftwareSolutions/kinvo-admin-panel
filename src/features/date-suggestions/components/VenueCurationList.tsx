import { useState } from 'react'
import { EmptyState } from '../../../shared/components/EmptyState'
import { ErrorState } from '../../../shared/components/ErrorState'
import { Skeleton } from '../../../shared/components/Skeleton'
import type { CursorPagination } from '../../../shared/hooks/useCursorPages'
import { DataTablePagination } from '../../../shared/table/DataTablePagination'
import { getPaginationLabel } from '../../../shared/utils/pagination'
import type { VenueSuggestion } from '../types/dateSuggestions.types'
import { VenueCard } from './VenueCard'
import { VenueEditModal } from './VenueEditModal'

type VenueCurationListProps = {
  venues: VenueSuggestion[]
  loading: boolean
  error: unknown
  onRetry: () => void
  pagination: CursorPagination
}

export function VenueCurationList({ venues, loading, error, onRetry, pagination }: VenueCurationListProps) {
  const [selectedVenue, setSelectedVenue] = useState<VenueSuggestion | null>(null)

  if (loading) {
    return (
      <div className="grid gap-3 min-[900px]:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-[134px] rounded-[22px]" />
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />
  }

  return (
    <>
      {venues.length === 0 && !pagination.hasPrevious ? (
        <EmptyState title="No venues match" description="Try a different search or clear the filters." />
      ) : (
        <>
          <div className="grid min-w-0 max-w-full gap-3 min-[900px]:grid-cols-2">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} onEdit={setSelectedVenue} />
            ))}
          </div>
          <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-300">
            <DataTablePagination label={getPaginationLabel(venues.length, 'venues')} pagination={pagination} />
          </div>
        </>
      )}
      <VenueEditModal venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
    </>
  )
}
