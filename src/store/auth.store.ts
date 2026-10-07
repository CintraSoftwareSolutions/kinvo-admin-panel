import { useSyncExternalStore } from 'react'
import { apiGet, apiSend, isApiError, type TokenResponse } from '../api/client'
import { endSession, getSession, hasSession, onSessionEnd, startSession } from '../api/session'
import { queryClient } from '../api/queryClient'
import type { AdminMe, AuthState, LoginCredentials, LoginResult } from '../features/auth/types/auth.types'

const initialState: AuthState = hasSession()
  ? { status: 'checking', me: null, notice: null }
  : { status: 'unauthenticated', me: null, notice: null }

let authState = initialState
const listeners = new Set<() => void>()

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

// The client ends the session on AUTH_TOKEN_INVALID, AUTH_REQUIRED or a refused
// refresh. Reflect that here so the router sends the operator to login.
onSessionEnd((reason) => {
  queryClient.clear()
  setAuthState({
    status: 'unauthenticated',
    me: null,
    notice: reason === 'signed-out' ? null : 'Your session has ended. Please sign in again.',
  })
})

async function loadMe(): Promise<LoginResult> {
  try {
    const me = await apiGet<AdminMe>('/admin/me')
    setAuthState({ status: 'authenticated', me, notice: null })
    return { ok: true }
  } catch (error) {
    if (isApiError(error) && (error.status === 403 || error.code === 'FORBIDDEN')) {
      // Signed in, but not staff. Drop the tokens: this panel is no use to them.
      const message = error.message
      endSession('signed-out')
      setAuthState({ status: 'unauthenticated', me: null, notice: message })
      return { ok: false, error: message }
    }
    if (!hasSession()) {
      return { ok: false, error: isApiError(error) ? error.message : 'Sign-in failed.' }
    }
    const message = isApiError(error) ? error.message : 'Could not load your admin profile.'
    setAuthState({ status: 'error', me: null, notice: message })
    return { ok: false, error: message }
  }
}

let bootStarted = false

/** Called once on app start: if tokens are stored, confirm them with /admin/me. */
function boot() {
  if (bootStarted) return
  bootStarted = true
  if (hasSession()) {
    void loadMe()
  }
}

function retry() {
  setAuthState({ status: 'checking', me: null, notice: null })
  void loadMe()
}

async function login(credentials: LoginCredentials): Promise<LoginResult> {
  try {
    const tokens = await apiSend<TokenResponse>(
      'POST',
      '/auth/login',
      { email: credentials.email.trim(), password: credentials.password },
      { auth: false },
    )
    startSession({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token }, credentials.remember)
  } catch (error) {
    return { ok: false, error: isApiError(error) ? error.message : 'Sign-in failed. Please try again.' }
  }

  setAuthState({ status: 'checking', me: null, notice: null })
  return loadMe()
}

async function logout() {
  const refreshToken = getSession()?.refreshToken
  endSession('signed-out')
  if (refreshToken) {
    // Best effort: the local session is already gone either way.
    try {
      await apiSend('POST', '/auth/logout', { refresh_token: refreshToken }, { auth: false })
    } catch {
      // ignore
    }
  }
}

async function requestPasswordReset(email: string): Promise<LoginResult> {
  try {
    await apiSend('POST', '/auth/forgot-password', { email: email.trim() }, { auth: false })
    return { ok: true }
  } catch (error) {
    return { ok: false, error: isApiError(error) ? error.message : 'Could not send a reset code.' }
  }
}

async function resetPassword(input: { email: string; code: string; password: string }): Promise<LoginResult> {
  try {
    await apiSend(
      'POST',
      '/auth/reset-password',
      { email: input.email.trim(), code: input.code.trim(), password: input.password },
      { auth: false },
    )
    return { ok: true }
  } catch (error) {
    return { ok: false, error: isApiError(error) ? error.message : 'Could not reset the password.' }
  }
}

export const authStore = {
  boot,
  getSnapshot,
  login,
  logout,
  requestPasswordReset,
  resetPassword,
  retry,
  subscribe,
}

export function useAuthStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return {
    ...state,
    isAuthenticated: state.status === 'authenticated',
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    retry,
  }
}
