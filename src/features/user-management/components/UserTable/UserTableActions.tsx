import { ActionIconButton } from '../../../../shared/components/ActionIconButton'
import { IconButtonGroup } from '../../../../shared/components/IconButtonGroup'
import { appIcons, type AppIcon } from '../../../../shared/icons/appIcons'
import { QuickActionDropdown } from './QuickActionDropdown'
import type { QuickActionMenuItem } from './QuickActionDropdown'

type UserTableActionVariant = 'user' | 'membership' | 'activity'

type UserTableActionsProps = {
  variant?: UserTableActionVariant
  onView?: () => void
  onSecondary?: () => void
  moreActions: QuickActionMenuItem[]
}

const secondaryActions = {
  user: { icon: appIcons.actions.restrict, label: 'Restrict account' },
  membership: { icon: appIcons.actions.membership, label: 'View membership' },
  activity: { icon: appIcons.actions.reviewActivity, label: 'Review activity' },
} satisfies Record<UserTableActionVariant, { icon: AppIcon; label: string }>

export function UserTableActions({ variant = 'user', onView, onSecondary, moreActions }: UserTableActionsProps) {
  const secondaryAction = secondaryActions[variant]
  return (
    <IconButtonGroup>
      <ActionIconButton icon={appIcons.actions.view} label="View details" onClick={onView} />
      <ActionIconButton icon={secondaryAction.icon} label={secondaryAction.label} onClick={onSecondary} />
      <QuickActionDropdown items={moreActions} />
    </IconButtonGroup>
  )
}
