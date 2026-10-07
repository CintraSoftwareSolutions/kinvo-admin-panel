export type VenueStatus = 'Featured' | 'Pending review'

export type VenueSuggestion = {
  id: string
  name: string
  category: string
  status: VenueStatus
}
