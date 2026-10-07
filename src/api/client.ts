// The only module that knows about fetch, the response envelope, or tokens.
// Everything else calls apiGet/apiList/apiSend and receives unwrapped data or an ApiError.

import { endSession, getSession, rotateSession, type SessionTokens } from './session'

const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

export type ApiErrorDetails = Record<string, unknown> | null

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details: ApiErrorDetails

  constructor(status: number, code: string, message: string, details: ApiErrorDetails) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }

  /** Set on 403 FORBIDDEN: the permission key this operator lacks. */
  get requiredPermission(): string | null {
    const value = this.details?.required_permission
    return typeof value === 'string' ? value : null
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export type Pagination = {
  next_cursor: string | null
  has_more: boolean
  limit: number
}

export type Page<T> = {
  items: T[]
  pagination: Pagination
}

type Envelope =
  | { success: true; data: unknown; meta: { pagination?: Pagination } | null }
  | { success: false; error: { code: string; message: string; details: ApiErrorDetails } }

export type QueryParams = Record<string, string | number | boolean | null | undefined>

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  query?: QueryParams
  body?: unknown
  auth?: boolean
  signal?: AbortSignal
}

function buildUrl(path: string, query?: QueryParams) {
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
  if (!query) return url
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue
    params.set(key, String(value))
  }
  const search = params.toString()
  return search ? `${url}?${search}` : url
}

async function send(path: string, options: RequestOptions, accessToken: string | null) {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  let response: Response
  try {
    response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      credentials: 'omit',
      signal: options.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'NETWORK_ERROR', 'Could not reach the Kinvo API. Check your connection and try again.', null)
  }

  let envelope: Envelope | null = null
  try {
    envelope = (await response.json()) as Envelope
  } catch {
    envelope = null
  }

  if (!envelope || typeof envelope !== 'object' || !('success' in envelope)) {
    throw new ApiError(
      response.status,
      'BAD_RESPONSE',
      `The API returned an unexpected response (HTTP ${response.status}).`,
      null,
    )
  }

  if (!envelope.success) {
    const { code, message, details } = envelope.error
    throw new ApiError(response.status, code, message, details ?? null)
  }

  return envelope
}

// Refresh tokens rotate and a replayed one revokes the whole family, so at most
// one refresh may be in flight. Every caller that hits AUTH_TOKEN_EXPIRED awaits it.
let refreshInFlight: Promise<SessionTokens> | null = null

function refreshTokens(): Promise<SessionTokens> {
  if (refreshInFlight) return refreshInFlight

  const session = getSession()
  if (!session) {
    return Promise.reject(new ApiError(401, 'AUTH_REQUIRED', 'Please sign in.', null))
  }

  refreshInFlight = (async () => {
    try {
      const envelope = await send('/auth/refresh', { method: 'POST', body: { refresh_token: session.refreshToken } }, null)
      if (!envelope.success) throw new Error('unreachable')
      const data = envelope.data as TokenResponse
      const tokens = { accessToken: data.access_token, refreshToken: data.refresh_token }
      rotateSession(tokens)
      return tokens
    } catch (error) {
      // A network blip should not throw the operator out; anything the server refused should.
      if (!(isApiError(error) && error.code === 'NETWORK_ERROR')) {
        endSession('expired')
      }
      throw error
    } finally {
      refreshInFlight = null
    }
  })()

  return refreshInFlight
}

async function request(path: string, options: RequestOptions = {}) {
  const useAuth = options.auth !== false
  const tokenUsed = useAuth ? (getSession()?.accessToken ?? null) : null

  try {
    return await send(path, options, tokenUsed)
  } catch (error) {
    if (!useAuth || !isApiError(error)) throw error

    if (error.code === 'AUTH_TOKEN_EXPIRED') {
      // If another request already rotated the token, just retry with the new one.
      const latest = getSession()?.accessToken ?? null
      const tokens = latest && latest !== tokenUsed ? { accessToken: latest } : await refreshTokens()
      return send(path, options, tokens.accessToken)
    }

    if (error.code === 'AUTH_TOKEN_INVALID') {
      endSession('invalid')
    } else if (error.code === 'AUTH_REQUIRED') {
      endSession('expired')
    }
    throw error
  }
}

export type TokenResponse = {
  access_token: string
  refresh_token: string
  token_type: 'Bearer'
  expires_in: number
}

export async function apiGet<T>(path: string, query?: QueryParams, signal?: AbortSignal): Promise<T> {
  const envelope = await request(path, { query, signal })
  return (envelope as { data: unknown }).data as T
}

export async function apiList<T>(path: string, query?: QueryParams, signal?: AbortSignal): Promise<Page<T>> {
  const envelope = (await request(path, { query, signal })) as { data: unknown; meta: { pagination?: Pagination } | null }
  const items = Array.isArray(envelope.data) ? (envelope.data as T[]) : []
  const pagination = envelope.meta?.pagination ?? { next_cursor: null, has_more: false, limit: items.length }
  return { items, pagination }
}

export async function apiSend<T>(
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
  options: { auth?: boolean } = {},
): Promise<T> {
  const envelope = await request(path, { method, body, auth: options.auth })
  return (envelope as { data: unknown }).data as T
}

/** Fetch every page of a cursor list. Only for lists known to be small. */
export async function apiListAll<T>(path: string, query: QueryParams = {}, maxPages = 20): Promise<T[]> {
  const all: T[] = []
  let cursor: string | null = null
  for (let page = 0; page < maxPages; page += 1) {
    const result: Page<T> = await apiList<T>(path, { ...query, cursor })
    all.push(...result.items)
    if (!result.pagination.has_more || !result.pagination.next_cursor) break
    cursor = result.pagination.next_cursor
  }
  return all
}
