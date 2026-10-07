import { routePaths } from '../app/router/routePaths'
import type { PermissionKey } from '../features/auth/types/auth.types'
import { appIcons } from '../shared/icons/appIcons'
import type { AppIcon } from '../shared/icons/appIcons'

export type NavigationItem = {
  label: string
  path: (typeof routePaths)[keyof typeof routePaths]
  icon: AppIcon
  /** The read permission a screen needs. Presentation only; the API enforces it. */
  permission: PermissionKey
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'User management',
    path: routePaths.userManagement,
    icon: appIcons.navigation.userManagement,
    permission: 'users.read',
  },
  {
    label: 'Content moderation',
    path: routePaths.contentModeration,
    icon: appIcons.navigation.contentModeration,
    permission: 'moderation.read',
  },
  {
    label: 'Date suggestions',
    path: routePaths.dateSuggestions,
    icon: appIcons.navigation.dateSuggestions,
    permission: 'venues.read',
  },
  {
    label: 'Subscription management',
    path: routePaths.subscription,
    icon: appIcons.navigation.subscription,
    permission: 'subscriptions.read',
  },
  {
    label: 'Analytics dashboard',
    path: routePaths.analyticsDashboard,
    icon: appIcons.navigation.analytics,
    permission: 'analytics.read',
  },
]
