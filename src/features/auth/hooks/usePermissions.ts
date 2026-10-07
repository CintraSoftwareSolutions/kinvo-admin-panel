import { useCallback } from 'react'
import { useAuth } from './useAuth'
import { useReadOnly } from './useGuardrails'
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

/**
 * Whether a mutating control should be enabled, and if not, why — for the
 * button's title so a disabled control explains itself.
 */
export function useActionGate() {
  const { can } = usePermissions()
  const readOnly = useReadOnly()

  return useCallback(
    (permission: PermissionKey) => {
      if (readOnly) return { allowed: false, reason: 'Read-only mode is on: admin changes are paused.' }
      if (!can(permission)) return { allowed: false, reason: `Requires ${permission}` }
      return { allowed: true, reason: undefined }
    },
    [can, readOnly],
  )
}
