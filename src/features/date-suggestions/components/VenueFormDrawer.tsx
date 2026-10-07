import { useState } from 'react'
import { useActionGate } from '../../auth/hooks/usePermissions'
import { InlineError } from '../../../shared/components/InlineError'
import { Modal } from '../../../shared/components/Modal'
import { FormError } from '../../../shared/forms/FormError'
import { Input } from '../../../shared/forms/Input'
import { Select } from '../../../shared/forms/Select'
import { Textarea } from '../../../shared/forms/Textarea'
import { cn } from '../../../shared/utils/cn'
import { humanize } from '../../../shared/utils/humanize'
import { useCreateVenue } from '../hooks/useVenueSuggestions'
import { venueCategories, venueModes, type NewVenue, type VenueCategory, type VenueMode } from '../types/dateSuggestions.types'

type VenueFormDrawerProps = {
  open: boolean
  onClose: () => void
}

export function VenueFormDrawer({ open, onClose }: VenueFormDrawerProps) {
  return (
    <Modal open={open} title="Add a venue" onClose={onClose}>
      {open ? <VenueForm onClose={onClose} /> : null}
    </Modal>
  )
}

type FormErrors = Partial<Record<'name' | 'modes' | 'longitude' | 'latitude' | 'priceLevel', string>>

function parseCoordinate(value: string, limit: number) {
  const trimmed = value.trim()
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) return null
  const number = Number(trimmed)
  return Math.abs(number) <= limit ? number : null
}

function VenueForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<VenueCategory>('cafe')
  const [modes, setModes] = useState<VenueMode[]>([])
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [priceLevel, setPriceLevel] = useState('')
  const [longitude, setLongitude] = useState('')
  const [latitude, setLatitude] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const create = useCreateVenue()
  const gate = useActionGate()('venues.write')

  function toggleMode(mode: VenueMode) {
    setModes((current) => (current.includes(mode) ? current.filter((item) => item !== mode) : [...current, mode]))
    setErrors((current) => ({ ...current, modes: undefined }))
  }

  function handleSubmit() {
    const lng = parseCoordinate(longitude, 180)
    const lat = parseCoordinate(latitude, 90)
    const price = priceLevel.trim() ? Number(priceLevel) : undefined
    const nextErrors: FormErrors = {
      name: name.trim() ? undefined : 'Name is required',
      modes: modes.length > 0 ? undefined : 'Choose at least one mode',
      longitude: lng === null ? 'Longitude is required, between -180 and 180' : undefined,
      latitude: lat === null ? 'Latitude is required, between -90 and 90' : undefined,
      priceLevel: price === undefined || Number.isInteger(price) ? undefined : 'Use a whole number',
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean) || lng === null || lat === null) return

    const venue: NewVenue = {
      name: name.trim(),
      category,
      modes,
      longitude: lng,
      latitude: lat,
      ...(description.trim() ? { description: description.trim() } : {}),
      ...(address.trim() ? { address: address.trim() } : {}),
      ...(city.trim() ? { city: city.trim() } : {}),
      ...(country.trim() ? { country: country.trim() } : {}),
      ...(price !== undefined ? { price_level: price } : {}),
    }
    create.mutate(venue, { onSuccess: onClose })
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <FormError message={errors.name} />
      </div>
      <Select label="Category" value={category} onChange={(event) => setCategory(event.target.value as VenueCategory)}>
        {venueCategories.map((item) => (
          <option key={item} value={item}>
            {humanize(item)}
          </option>
        ))}
      </Select>
      <div className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">Modes</span>
        <div className="flex flex-wrap gap-2">
          {venueModes.map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={modes.includes(mode)}
              onClick={() => toggleMode(mode)}
              className={cn(
                'h-9 rounded-full px-3 text-xs font-semibold transition',
                modes.includes(mode) ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-violet-50',
              )}
            >
              {humanize(mode)}
            </button>
          ))}
        </div>
        <FormError message={errors.modes} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Input label="Longitude" inputMode="decimal" placeholder="-0.1276" value={longitude} onChange={(event) => setLongitude(event.target.value)} />
          <FormError message={errors.longitude} />
        </div>
        <div className="grid gap-2">
          <Input label="Latitude" inputMode="decimal" placeholder="51.5072" value={latitude} onChange={(event) => setLatitude(event.target.value)} />
          <FormError message={errors.latitude} />
        </div>
      </div>
      <p className="-mt-2 text-xs text-slate-400">Required: every venue lookup is a radius search. Location can’t be changed later.</p>
      <Textarea label="Description (optional)" value={description} onChange={(event) => setDescription(event.target.value)} />
      <Input label="Address (optional)" value={address} onChange={(event) => setAddress(event.target.value)} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Input label="City" value={city} onChange={(event) => setCity(event.target.value)} />
        <Input label="Country" placeholder="GB" value={country} onChange={(event) => setCountry(event.target.value)} />
        <div className="grid gap-2">
          <Input label="Price level" inputMode="numeric" value={priceLevel} onChange={(event) => setPriceLevel(event.target.value)} />
          <FormError message={errors.priceLevel} />
        </div>
      </div>
      <InlineError error={create.error} />
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
          disabled={!gate.allowed || create.isPending}
          title={gate.reason}
          onClick={handleSubmit}
          className="h-11 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
        >
          {create.isPending ? 'Adding…' : 'Add venue'}
        </button>
      </div>
    </div>
  )
}
