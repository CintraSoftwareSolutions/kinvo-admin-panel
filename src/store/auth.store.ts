import { useSyncExternalStore } from 'react'
import { authStorageKey, mockAdminUser } from '../features/auth/data/auth.mock'
import type { AuthState, LoginCredentials, LoginResult } from '../features/auth/types/auth.types'
import { isValidEmail } from '../features/auth/utils/authValidation'

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
}

let authState = loadStoredSession()
const listeners = new Set<() => void>()

function loadStoredSession(): AuthState {
  try {
    const storedSession = window.localStorage.getItem(authStorageKey)
    if (!storedSession) {
      return initialState
    }

    const parsedSession = JSON.parse(storedSession) as AuthState
    if (!parsedSession.currentUser || !parsedSession.isAuthenticated) {
      return initialState
    }

    return parsedSession
  } catch {
    return initialState
  }
}

function persistSession(state: AuthState, remember: boolean) {
  if (!remember) {
    window.localStorage.removeItem(authStorageKey)
    return
  }

  window.localStorage.setItem(authStorageKey, JSON.stringify(state))
}

function emitChange() {
  listeners.forEach((listener) => listener())
}

function setAuthState(nextState: AuthState) {
  authState = nextState
  emitChange()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return authState
}

function getServerSnapshot() {
  return initialState
}

function login(credentials: LoginCredentials): LoginResult {
  const email = credentials.email.trim().toLowerCase()
  const password = credentials.password.trim()

  if (!isValidEmail(email) || !password) {
    return {
      ok: false,
      error: 'Enter a valid email and password',
    }
  }

  const nextState: AuthState = {
    currentUser: mockAdminUser,
    isAuthenticated: true,
  }

  persistSession(nextState, credentials.remember)
  setAuthState(nextState)

  return { ok: true }
}

function logout() {
  window.localStorage.removeItem(authStorageKey)
  setAuthState(initialState)
}

function resetPassword() {
  return { ok: true }
}

export const authStore = {
  getSnapshot,
  login,
  logout,
  resetPassword,
  subscribe,
}

export function useAuthStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return {
    ...state,
    login,
    logout,
    resetPassword,
  }
}
