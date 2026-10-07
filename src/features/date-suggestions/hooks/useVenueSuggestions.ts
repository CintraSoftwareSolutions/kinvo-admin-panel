import { useMemo, useState } from 'react'
import { venuesMock } from '../data/venues.mock'
import type { VenueStatus, VenueSuggestion } from '../types/dateSuggestions.types'

function matchesVenue(venue: VenueSuggestion, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return [venue.name, venue.category, venue.status].some((value) => value.toLowerCase().includes(normalizedQuery))
}

export function useVenueSuggestions(query: string) {
  const [venues, setVenues] = useState(venuesMock)
  const filteredVenues = useMemo(() => venues.filter((venue) => matchesVenue(venue, query)), [venues, query])

  function updateVenueStatus(venueId: string, status: VenueStatus) {
    setVenues((currentVenues) => currentVenues.map((venue) => (venue.id === venueId ? { ...venue, status } : venue)))
  }

  return {
    venues: filteredVenues,
    updateVenueStatus,
  }
}
