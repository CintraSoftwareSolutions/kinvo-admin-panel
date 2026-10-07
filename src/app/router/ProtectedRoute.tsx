import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { navigateTo, routePaths } from './routePaths'

type ProtectedRouteProps = {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo(routePaths.login, { replace: true })
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  return children
}
