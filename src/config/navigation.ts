import { routePaths } from '../app/router/routePaths'
import { appIcons } from '../shared/icons/appIcons'
import type { AppIcon } from '../shared/icons/appIcons'

type NavigationItem = {
  label: string
  path: (typeof routePaths)[keyof typeof routePaths]
  icon: AppIcon
  count?: number
  disabled?: boolean
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'User management',
    path: routePaths.userManagement,
    icon: appIcons.navigation.userManagement,
    count: 8,
  },
  {
    label: 'Content moderation',
    path: routePaths.contentModeration,
    icon: appIcons.navigation.contentModeration,
    count: 3,
  },
  {
    label: 'Date suggestions',
    path: routePaths.dateSuggestions,
    icon: appIcons.navigation.dateSuggestions,
  },
  {
    label: 'Subscription management',
    path: routePaths.subscription,
    icon: appIcons.navigation.subscription,
  },
  {
    label: 'Analytics dashboard',
    path: routePaths.analyticsDashboard,
    icon: appIcons.navigation.analytics,
  },
]
