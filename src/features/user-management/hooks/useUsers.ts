import { useDebounce } from '../../../shared/hooks/useDebounce'
import { useCursorPages } from '../../../shared/hooks/useCursorPages'
import { userKeys } from '../api/userManagement.api'
import type { AccountStatus, AuditEntry, Tier, User } from '../types/userManagement.types'

export type UserFilters = {
  status: AccountStatus | ''
  tier: Tier | ''
  flagged: boolean
}

/** GET /admin/users, searched and filtered server-side on the honest fields. */
export function useUsers(query: string, filters: UserFilters) {
  const search = useDebounce(query.trim(), 300)
  return useCursorPages<User>({
    queryKey: userKeys.list,
    path: '/admin/users',
    params: {
      search: search || undefined,
      status: filters.status || undefined,
      tier: filters.tier || undefined,
      flagged: filters.flagged || undefined,
    },
  })
}

export function useAuditLog(enabled: boolean) {
  return useCursorPages<AuditEntry>({
    queryKey: userKeys.audit,
    path: '/admin/audit-log',
    enabled,
  })
}
