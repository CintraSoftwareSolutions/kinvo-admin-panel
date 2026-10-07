import type { AppIcon } from '../icons/appIcons'

export type NavigationItem = {
  label: string
  path: string
  icon: AppIcon
  count?: number
  disabled?: boolean
}
