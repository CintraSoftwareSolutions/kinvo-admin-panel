import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiSend } from '../../../api/client'
import { useCursorPages } from '../../../shared/hooks/useCursorPages'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import type { NewVenue, VenueCategory, VenuePatch, VenueSuggestion } from '../types/dateSuggestions.types'

const venueKeys = { all: ['admin', 'venues'] as const }

export type VenueFilters = {
  category: VenueCategory | ''
  active: '' | 'true' | 'false'
  reviewed: '' | 'true' | 'false'
}

/** GET /admin/venues, searched and filtered server-side. */
export function useVenueSuggestions(query: string, filters: VenueFilters) {
  const search = useDebounce(query.trim(), 300)
  return useCursorPages<VenueSuggestion>({
    queryKey: venueKeys.all,
    path: '/admin/venues',
    params: {
      search: search || undefined,
      category: filters.category || undefined,
      active: filters.active || undefined,
      reviewed: filters.reviewed || undefined,
    },
  })
}

export function useUpdateVenue() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: VenuePatch }) => apiSend<unknown>('PATCH', `/admin/venues/${id}`, patch),
    onSettled: () => queryClient.invalidateQueries({ queryKey: venueKeys.all }),
  })
}

export function useCreateVenue() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (venue: NewVenue) => apiSend<unknown>('POST', '/admin/venues', venue),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: venueKeys.all }),
  })
}
