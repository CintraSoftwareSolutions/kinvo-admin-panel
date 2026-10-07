import { useCallback } from 'react'
import { useAuth } from './useAuth'
import type { PermissionKey } from '../types/auth.types'

/**
 * Presentation only: hides screens and disables buttons. Every endpoint checks
 * permissions for itself, and a refused call still answers 403 with the key.
 */
export function usePermissions() {
  const { me } = useAuth()

  const can = useCallback((permission: PermissionKey) => Boolean(me?.permissions.includes(permission)), [me])

  return { can, isSuperAdmin: Boolean(me?.is_super_admin) }
}
