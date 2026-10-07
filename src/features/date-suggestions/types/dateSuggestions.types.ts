export const venueCategories = [
  'cafe',
  'restaurant',
  'park',
  'gym',
  'study_spot',
  'pet_friendly',
  'romantic',
  'health_conscious',
] as const

export const venueModes = [
  'dating',
  'study_buddy',
  'networking',
  'trading',
  'foodie',
  'cuddle',
  'pet_dates',
  'fitness',
] as const

export type VenueCategory = (typeof venueCategories)[number]
export type VenueMode = (typeof venueModes)[number]

/** Two-value display label; act on the three booleans beside it. */
export type VenueStatus = 'Featured' | 'Pending review'

/** Row of GET /admin/venues */
export type VenueSuggestion = {
  id: string
  name: string
  category: VenueCategory
  status: VenueStatus
  is_featured: boolean
  is_reviewed: boolean
  is_active: boolean
  city: string | null
  country: string | null
  modes: VenueMode[]
  rating: number | null
  price_level: number | null
  created_at: string
}

/** POST /admin/venues — longitude and latitude are required: every lookup is a radius query. */
export type NewVenue = {
  name: string
  category: VenueCategory
  description?: string
  address?: string
  city?: string
  country?: string
  modes: VenueMode[]
  price_level?: number
  longitude: number
  latitude: number
}

/** PATCH /admin/venues/{id} — location is not editable, and there is no delete. */
export type VenuePatch = {
  name?: string
  description?: string
  category?: VenueCategory
  is_featured?: boolean
  is_reviewed?: boolean
  is_active?: boolean
}
