// Token storage. "Remember me" keeps tokens in localStorage; otherwise they live
// in sessionStorage and die with the tab. Bearer tokens only — never cookies.

const storageKey = 'kinvo-admin-tokens'

export type SessionTokens = {
  accessToken: string
  refreshToken: string
}

type StoredSession = SessionTokens & { remember: boolean }

let current: StoredSession | null = readStored()
const endListeners = new Set<(reason: SessionEndReason) => void>()

export type SessionEndReason = 'signed-out' | 'expired' | 'invalid'

function readStored(): StoredSession | null {
  for (const storage of [safeStorage('local'), safeStorage('session')]) {
    try {
      const raw = storage?.getItem(storageKey)
      if (!raw) continue
      const parsed = JSON.parse(raw) as Partial<StoredSession>
      if (typeof parsed.accessToken === 'string' && typeof parsed.refreshToken === 'string') {
        return { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken, remember: Boolean(parsed.remember) }
      }
    } catch {
      // Unreadable storage is the same as no session.
    }
  }
  return null
}

function safeStorage(kind: 'local' | 'session'): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

function writeStored(session: StoredSession | null) {
  for (const storage of [safeStorage('local'), safeStorage('session')]) {
    try {
      storage?.removeItem(storageKey)
    } catch {
      // ignore
    }
  }
  if (!session) return
  try {
    safeStorage(session.remember ? 'local' : 'session')?.setItem(storageKey, JSON.stringify(session))
  } catch {
    // Storage blocked: the session still works in memory for this tab.
  }
}

export function getSession(): SessionTokens | null {
  return current
}

export function hasSession() {
  return current !== null
}

export function startSession(tokens: SessionTokens, remember: boolean) {
  current = { ...tokens, remember }
  writeStored(current)
}

/** Store rotated tokens from a refresh, keeping the original remember choice. */
export function rotateSession(tokens: SessionTokens) {
  current = { ...tokens, remember: current?.remember ?? false }
  writeStored(current)
}

export function endSession(reason: SessionEndReason) {
  const hadSession = current !== null
  current = null
  writeStored(null)
  if (hadSession) {
    endListeners.forEach((listener) => listener(reason))
  }
}

export function onSessionEnd(listener: (reason: SessionEndReason) => void) {
  endListeners.add(listener)
  return () => {
    endListeners.delete(listener)
  }
}
