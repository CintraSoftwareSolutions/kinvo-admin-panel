import { AdminOperationsShell } from '../../../shared/components/AdminOperationsShell'
import { appIcons } from '../../../shared/icons/appIcons'
import { VenueCurationList } from '../components/VenueCurationList'
import { useVenueSuggestions } from '../hooks/useVenueSuggestions'

type DateSuggestionsPageProps = {
  searchQuery: string
}

const venueCurationPill = {
  value: 'venue-curation',
  label: 'Venue curation',
  icon: appIcons.adminOperations.venueCuration,
}

export function DateSuggestionsPage({ searchQuery }: DateSuggestionsPageProps) {
  const { venues, updateVenueStatus } = useVenueSuggestions(searchQuery)

  return (
    <AdminOperationsShell
      pill={venueCurationPill}
      label="Date suggestions management"
      title="Suggested venues curation"
    >
      <VenueCurationList venues={venues} onUpdateStatus={updateVenueStatus} />
    </AdminOperationsShell>
  )
}
