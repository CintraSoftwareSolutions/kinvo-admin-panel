export type PermissionKey =
  | 'users.read'
  | 'users.suspend'
  | 'users.role'
  | 'moderation.read'
  | 'moderation.resolve'
  | 'verification.read'
  | 'verification.review'
  | 'venues.read'
  | 'venues.write'
  | 'subscriptions.read'
  | 'subscriptions.write'
  | 'analytics.read'
  | 'audit.read'
  | 'roles.read'
  | 'roles.write'

/** GET /admin/me */
export type AdminMe = {
  id: string
  role: 'user' | 'moderator' | 'admin'
  is_super_admin: boolean
  permissions: string[]
  roles: Array<{ id: string; key: string; title: string }>
  display_name?: string | null
  email?: string | null
}

export type LoginCredentials = {
  email: string
  password: string
  remember: boolean
}

export type LoginResult = {
  ok: boolean
  error?: string
}

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated' | 'error'

export type AuthState = {
  status: AuthStatus
  me: AdminMe | null
  /** Shown on the login screen, e.g. why the session ended. */
  notice: string | null
}
