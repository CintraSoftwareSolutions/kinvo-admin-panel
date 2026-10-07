export const routePaths = {
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  userManagement: '/user-management',
  contentModeration: '/content-moderation',
  dateSuggestions: '/date-suggestions',
  subscription: '/subscription-management',
  analyticsDashboard: '/analytics-dashboard',
} as const

export type RoutePath = (typeof routePaths)[keyof typeof routePaths]

export function navigateTo(path: RoutePath, options: { replace?: boolean } = {}) {
  if (window.location.pathname !== path) {
    if (options.replace) {
      window.history.replaceState(null, '', path)
    } else {
      window.history.pushState(null, '', path)
    }
  }

  // Always notify, even when the URL already matches: an earlier call may have
  // fired before the router's listener was attached (child effects run first).
  window.dispatchEvent(new PopStateEvent('popstate'))
}
