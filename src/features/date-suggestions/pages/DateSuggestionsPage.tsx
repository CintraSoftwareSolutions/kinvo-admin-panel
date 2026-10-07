import { useState } from 'react'
import { useActionGate } from '../../auth/hooks/usePermissions'
import { AdminOperationsShell } from '../../../shared/components/AdminOperationsShell'
import { Select } from '../../../shared/forms/Select'
import { appIcons } from '../../../shared/icons/appIcons'
import { humanize } from '../../../shared/utils/humanize'
import { VenueCurationList } from '../components/VenueCurationList'
import { VenueFormDrawer } from '../components/VenueFormDrawer'
import { useVenueSuggestions, type VenueFilters } from '../hooks/useVenueSuggestions'
import { venueCategories } from '../types/dateSuggestions.types'

type DateSuggestionsPageProps = {
  searchQuery: string
}

const venueCurationPill = {
  value: 'venue-curation',
  label: 'Venue curation',
  icon: appIcons.adminOperations.venueCuration,
}

const AddIcon = appIcons.actions.addUser

export function DateSuggestionsPage({ searchQuery }: DateSuggestionsPageProps) {
  const [filters, setFilters] = useState<VenueFilters>({ category: '', active: '', reviewed: '' })
  const [creating, setCreating] = useState(false)
  const venues = useVenueSuggestions(searchQuery, filters)
  const gate = useActionGate()('venues.write')

  return (
    <AdminOperationsShell pill={venueCurationPill} label="Date suggestions management" title="Suggested venues curation">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Select
          aria-label="Category"
          value={filters.category}
          onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value as VenueFilters['category'] }))}
        >
          <option value="">All categories</option>
          {venueCategories.map((category) => (
            <option key={category} value={category}>
              {humanize(category)}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Reviewed"
          value={filters.reviewed}
          onChange={(event) => setFilters((current) => ({ ...current, reviewed: event.target.value as VenueFilters['reviewed'] }))}
        >
          <option value="">Reviewed or not</option>
          <option value="true">Reviewed</option>
          <option value="false">Not reviewed</option>
        </Select>
        <Select
          aria-label="Active"
          value={filters.active}
          onChange={(event) => setFilters((current) => ({ ...current, active: event.target.value as VenueFilters['active'] }))}
        >
          <option value="">Active or inactive</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>
        <button
          type="button"
          onClick={() => setCreating(true)}
          disabled={!gate.allowed}
          title={gate.reason}
          className="ml-auto inline-flex h-11 items-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(111,61,204,0.26)] transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300 disabled:shadow-none"
        >
          <AddIcon className="h-4 w-4" aria-hidden="true" />
          Add venue
        </button>
      </div>
      <VenueCurationList
        venues={venues.items}
        loading={venues.isLoading}
        error={venues.error}
        onRetry={() => void venues.refetch()}
        pagination={venues.pagination}
      />
      <VenueFormDrawer open={creating} onClose={() => setCreating(false)} />
    </AdminOperationsShell>
  )
}
