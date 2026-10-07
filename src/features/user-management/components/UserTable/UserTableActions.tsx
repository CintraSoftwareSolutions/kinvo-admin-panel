import { ActionIconButton } from '../../../../shared/components/ActionIconButton'
import { IconButtonGroup } from '../../../../shared/components/IconButtonGroup'
import { appIcons } from '../../../../shared/icons/appIcons'
import { QuickActionDropdown } from './QuickActionDropdown'
import type { QuickActionMenuItem } from './QuickActionDropdown'

type UserTableActionsProps = {
  onView?: () => void
  onSecondary?: () => void
  secondaryLabel?: string
  moreActions: QuickActionMenuItem[]
}

export function UserTableActions({
  onView,
  onSecondary,
  secondaryLabel = 'Restrict account',
  moreActions,
}: UserTableActionsProps) {
  return (
    <IconButtonGroup>
      <ActionIconButton icon={appIcons.actions.view} label="View details" onClick={onView} />
      <ActionIconButton icon={appIcons.actions.restrict} label={secondaryLabel} onClick={onSecondary} />
      <QuickActionDropdown items={moreActions} />
    </IconButtonGroup>
  )
}
