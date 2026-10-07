import { useState } from 'react'
import { useActionGate } from '../../auth/hooks/usePermissions'
import { InlineError } from '../../../shared/components/InlineError'
import { Modal } from '../../../shared/components/Modal'
import { Input } from '../../../shared/forms/Input'
import { Select } from '../../../shared/forms/Select'
import { Textarea } from '../../../shared/forms/Textarea'
import { humanize } from '../../../shared/utils/humanize'
import { useUpdateVenue } from '../hooks/useVenueSuggestions'
import { venueCategories, type VenueCategory, type VenuePatch, type VenueSuggestion } from '../types/dateSuggestions.types'

type VenueEditModalProps = {
  venue: VenueSuggestion | null
  onClose: () => void
}

export function VenueEditModal({ venue, onClose }: VenueEditModalProps) {
  return (
    <Modal open={venue !== null} title="Edit & curate venue" onClose={onClose}>
      {venue ? <VenueEditBody key={venue.id} venue={venue} onClose={onClose} /> : null}
    </Modal>
  )
}

function VenueEditBody({ venue, onClose }: { venue: VenueSuggestion; onClose: () => void }) {
  const [name, setName] = useState(venue.name)
  const [category, setCategory] = useState<VenueCategory>(venue.category)
  const [description, setDescription] = useState('')
  const [isReviewed, setIsReviewed] = useState(venue.is_reviewed)
  const [isFeatured, setIsFeatured] = useState(venue.is_featured)
  const [isActive, setIsActive] = useState(venue.is_active)
  const update = useUpdateVenue()
  const gate = useActionGate()('venues.write')

  // Send only what changed. The list omits descriptions, so a blank one means "leave it".
  const patch: VenuePatch = {
    ...(name.trim() !== venue.name ? { name: name.trim() } : {}),
    ...(category !== venue.category ? { category } : {}),
    ...(description.trim() ? { description: description.trim() } : {}),
    ...(isReviewed !== venue.is_reviewed ? { is_reviewed: isReviewed } : {}),
    ...(isFeatured !== venue.is_featured ? { is_featured: isFeatured } : {}),
    ...(isActive !== venue.is_active ? { is_active: isActive } : {}),
  }
  const hasChanges = Object.keys(patch).length > 0

  return (
    <div className="grid gap-4">
      <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} />
      <Select label="Category" value={category} onChange={(event) => setCategory(event.target.value as VenueCategory)}>
        {venueCategories.map((item) => (
          <option key={item} value={item}>
            {humanize(item)}
          </option>
        ))}
      </Select>
      <Textarea
        label="Replace description (optional)"
        value={description}
        placeholder="Leave blank to keep the current description"
        onChange={(event) => setDescription(event.target.value)}
      />
      <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <Check label="Reviewed" detail="An editor has checked this venue." checked={isReviewed} onChange={setIsReviewed} />
        <Check
          label="Featured"
          detail="Review first: featuring an unreviewed venue is refused."
          checked={isFeatured}
          onChange={setIsFeatured}
        />
        <Check
          label="Active"
          detail="Inactive venues stop appearing in the app. This replaces delete."
          checked={isActive}
          onChange={setIsActive}
        />
      </div>
      <p className="text-xs text-slate-400">Location can’t be edited after creation.</p>
      <InlineError error={update.error} />
      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="h-11 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!gate.allowed || !hasChanges || !name.trim() || update.isPending}
          title={gate.reason}
          onClick={() => update.mutate({ id: venue.id, patch }, { onSuccess: onClose })}
          className="h-11 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
        >
          {update.isPending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}

type CheckProps = {
  label: string
  detail: string
  checked: boolean
  onChange: (value: boolean) => void
}

function Check({ label, detail, checked, onChange }: CheckProps) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-xl p-2 hover:bg-white">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
      />
      <span>
        <span className="block text-sm font-semibold text-slate-950">{label}</span>
        <span className="block text-xs text-slate-500">{detail}</span>
      </span>
    </label>
  )
}
