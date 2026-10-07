import type { ReactNode } from 'react'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { AuthCard, AuthPrimaryButton } from '../../features/auth/components/AuthCard'
import { AuthLayout } from '../layouts/AuthLayout'

type ProtectedRouteProps = {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // The redirect to /login for unauthenticated visitors lives in AppRouter.
  const { status, notice, retry, logout } = useAuth()

  if (status === 'checking') {
    return (
      <AuthLayout>
        <AuthCard className="py-10 text-center">
          <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading your workspace…</p>
        </AuthCard>
      </AuthLayout>
    )
  }

  if (status === 'error') {
    return (
      <AuthLayout>
        <AuthCard className="text-center">
          <h1 className="text-xl font-semibold text-slate-950">Couldn’t load your admin profile</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{notice}</p>
          <div className="mt-6 grid gap-3">
            <AuthPrimaryButton type="button" onClick={retry}>
              Try again
            </AuthPrimaryButton>
            <button
              type="button"
              className="text-sm font-semibold text-violet-700 transition hover:text-violet-800"
              onClick={() => void logout()}
            >
              Sign out
            </button>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  if (status !== 'authenticated') {
    return null
  }

  return children
}
