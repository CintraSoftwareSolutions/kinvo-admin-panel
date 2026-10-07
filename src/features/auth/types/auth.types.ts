export type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  avatar: string
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

export type AuthState = {
  currentUser: AdminUser | null
  isAuthenticated: boolean
}
