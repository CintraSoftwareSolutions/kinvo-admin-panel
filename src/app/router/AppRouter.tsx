import { lazy, Suspense, useEffect, useState } from 'react'
import { AdminLayout } from '../layouts/AdminLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { navigateTo, routePaths, type RoutePath } from './routePaths'
import { ProtectedRoute } from './ProtectedRoute'
import { PermissionGate } from './PermissionGate'
import type { PermissionKey } from '../../features/auth/types/auth.types'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { Skeleton } from '../../shared/components/Skeleton'

// Each screen is its own chunk, so the login page does not download the whole panel.
const UserManagementPage = lazy(() =>
  import('../../features/user-management/pages/UserManagementPage').then((module) => ({ default: module.UserManagementPage })),
)
const ContentModerationPage = lazy(() =>
  import('../../features/content-moderation/pages/ContentModerationPage').then((module) => ({ default: module.ContentModerationPage })),
)
const AnalyticsDashboardPage = lazy(() =>
  import('../../features/analytics-dashboard/pages/AnalyticsDashboardPage').then((module) => ({ default: module.AnalyticsDashboardPage })),
)
const SubscriptionManagementPage = lazy(() =>
  import('../../features/subscription-management/pages/SubscriptionManagementPage').then((module) => ({ default: module.SubscriptionManagementPage })),
)
const DateSuggestionsPage = lazy(() =>
  import('../../features/date-suggestions/pages/DateSuggestionsPage').then((module) => ({ default: module.DateSuggestionsPage })),
)

const routeMeta = {
  [routePaths.userManagement]: {
    title: 'User management',
    permission: 'users.read',
    searchPlaceholder: 'Search user management data',
  },
  [routePaths.contentModeration]: {
    title: 'Content moderation',
    permission: 'moderation.read',
    searchPlaceholder: 'Search content moderation data',
  },
  [routePaths.analyticsDashboard]: {
    title: 'Analytics dashboard',
    permission: 'analytics.read',
    searchPlaceholder: 'Search analytics dashboard data',
  },
  [routePaths.subscription]: {
    title: 'Admin operations',
    permission: 'subscriptions.read',
    titleBadge: 'Required modules only',
    searchPlaceholder: 'Search plans or date suggestions',
  },
  [routePaths.dateSuggestions]: {
    title: 'Admin operations',
    permission: 'venues.read',
    titleBadge: 'Required modules only',
    searchPlaceholder: 'Search plans or date suggestions',
  },
} as const satisfies Record<string, { title: string; permission: PermissionKey; searchPlaceholder: string; titleBadge?: string }>

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
  const { status, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPath, setCurrentPath] = useState<RoutePath>(() => getKnownPath(window.location.pathname))

  useEffect(() => {
    function handlePopState() {
      setCurrentPath(getKnownPath(window.location.pathname))
      setSearchQuery('')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated' && isAdminPath(currentPath)) {
      navigateTo(routePaths.login, { replace: true })
      return
    }

    if (isAuthenticated && currentPath === routePaths.login) {
      navigateTo(routePaths.userManagement, { replace: true })
    }
  }, [currentPath, isAuthenticated, status])

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
        <PermissionGate permission={meta.permission}>
          <Suspense fallback={<PageFallback />}>
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
          </Suspense>
        </PermissionGate>
      </AdminLayout>
    </ProtectedRoute>
  )
}

function PageFallback() {
  return (
    <div className="mx-auto w-full max-w-[1720px] px-3 py-3 sm:px-6 lg:px-7">
      <Skeleton className="h-[calc(100vh-170px)] rounded-[28px]" />
    </div>
  )
}
