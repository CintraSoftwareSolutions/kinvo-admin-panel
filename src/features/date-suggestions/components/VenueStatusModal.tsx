import { useEffect, useState } from 'react'
import { Modal } from '../../../shared/components/Modal'
import { cn } from '../../../shared/utils/cn'
import type { VenueStatus, VenueSuggestion } from '../types/dateSuggestions.types'

type VenueStatusModalProps = {
  venue: VenueSuggestion | null
  onClose: () => void
  onSave: (venueId: string, status: VenueStatus) => void
}

const statuses: VenueStatus[] = ['Featured', 'Pending review']

export function VenueStatusModal({ venue, onClose, onSave }: VenueStatusModalProps) {
  const [status, setStatus] = useState<VenueStatus>('Featured')

  useEffect(() => {
    if (venue) {
      setStatus(venue.status)
    }
  }, [venue])

  function handleSave() {
    if (!venue) {
      return
    }

    onSave(venue.id, status)
    onClose()
  }

  return (
    <Modal open={venue !== null} title="Move venue status" onClose={onClose}>
      <div className="grid gap-3">
        {statuses.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            className={cn(
              'h-11 rounded-full text-sm font-semibold transition',
              item === status ? 'bg-violet-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-violet-50',
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleSave}
        className="mt-5 h-10 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700"
      >
        Save status
      </button>
    </Modal>
  )
}
