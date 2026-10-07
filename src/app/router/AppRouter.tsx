import { useEffect, useState } from 'react'
import { AdminLayout } from '../layouts/AdminLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { navigateTo, routePaths, type RoutePath } from './routePaths'
import { ProtectedRoute } from './ProtectedRoute'
import { UserManagementPage } from '../../features/user-management/pages/UserManagementPage'
import { ContentModerationPage } from '../../features/content-moderation/pages/ContentModerationPage'
import { AnalyticsDashboardPage } from '../../features/analytics-dashboard/pages/AnalyticsDashboardPage'
import { SubscriptionManagementPage } from '../../features/subscription-management/pages/SubscriptionManagementPage'
import { DateSuggestionsPage } from '../../features/date-suggestions/pages/DateSuggestionsPage'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage'
import { useAuth } from '../../features/auth/hooks/useAuth'

const routeMeta = {
  [routePaths.userManagement]: {
    title: 'User management',
    searchPlaceholder: 'Search user management data',
  },
  [routePaths.contentModeration]: {
    title: 'Content moderation',
    searchPlaceholder: 'Search content moderation data',
  },
  [routePaths.analyticsDashboard]: {
    title: 'Analytics dashboard',
    searchPlaceholder: 'Search analytics dashboard data',
  },
  [routePaths.subscription]: {
    title: 'Admin operations',
    titleBadge: 'Required modules only',
    searchPlaceholder: 'Search plans or date suggestions',
  },
  [routePaths.dateSuggestions]: {
    title: 'Admin operations',
    titleBadge: 'Required modules only',
    searchPlaceholder: 'Search plans or date suggestions',
  },
} as const

type AdminPath = keyof typeof routeMeta

const routeValues = Object.values(routePaths) as RoutePath[]
const authPaths = [routePaths.login, routePaths.forgotPassword, routePaths.resetPassword] as const

function isAdminPath(path: RoutePath): path is AdminPath {
  return path in routeMeta
}

function isAuthPath(path: RoutePath) {
  return authPaths.includes(path as (typeof authPaths)[number])
}

function getKnownPath(pathname: string): RoutePath {
  if (pathname === '/') {
    return routePaths.userManagement
  }

  return routeValues.includes(pathname as RoutePath) ? (pathname as RoutePath) : routePaths.userManagement
}

export function AppRouter() {
  const { isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPath, setCurrentPath] = useState<RoutePath>(() => getKnownPath(window.location.pathname))

  useEffect(() => {
    setCurrentPath(getKnownPath(window.location.pathname))
  }, [])

  useEffect(() => {
    function handlePopState() {
      setCurrentPath(getKnownPath(window.location.pathname))
      setSearchQuery('')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (!isAuthenticated && isAdminPath(currentPath)) {
      navigateTo(routePaths.login, { replace: true })
      return
    }

    if (isAuthenticated && currentPath === routePaths.login) {
      navigateTo(routePaths.userManagement, { replace: true })
    }
  }, [currentPath, isAuthenticated])

  function handleNavigate(path: RoutePath) {
    const nextPath = getKnownPath(path)
    if (nextPath === currentPath) {
      return
    }

    navigateTo(nextPath)
    setSearchQuery('')
  }

  if (isAuthPath(currentPath)) {
    return (
      <AuthLayout>
        {currentPath === routePaths.forgotPassword ? (
          <ForgotPasswordPage />
        ) : currentPath === routePaths.resetPassword ? (
          <ResetPasswordPage />
        ) : (
          <LoginPage />
        )}
      </AuthLayout>
    )
  }

  const adminPath = isAdminPath(currentPath) ? currentPath : routePaths.userManagement
  const meta = routeMeta[adminPath]

  return (
    <ProtectedRoute>
      <AdminLayout
        currentPath={adminPath}
        title={meta.title}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigate={handleNavigate}
        searchPlaceholder={meta.searchPlaceholder}
        titleBadge={'titleBadge' in meta ? meta.titleBadge : undefined}
      >
        {adminPath === routePaths.analyticsDashboard ? (
          <AnalyticsDashboardPage searchQuery={searchQuery} />
        ) : adminPath === routePaths.contentModeration ? (
          <ContentModerationPage searchQuery={searchQuery} />
        ) : adminPath === routePaths.subscription ? (
          <SubscriptionManagementPage searchQuery={searchQuery} />
        ) : adminPath === routePaths.dateSuggestions ? (
          <DateSuggestionsPage searchQuery={searchQuery} />
        ) : (
          <UserManagementPage searchQuery={searchQuery} />
        )}
      </AdminLayout>
    </ProtectedRoute>
  )
}
