import { ActionIconButton } from '../../../../shared/components/ActionIconButton'
import { IconButtonGroup } from '../../../../shared/components/IconButtonGroup'
import { appIcons } from '../../../../shared/icons/appIcons'

export function ReportActions() {
  return (
    <IconButtonGroup>
      <ActionIconButton icon={appIcons.contentModeration.actions.view} label="View report" />
      <ActionIconButton icon={appIcons.contentModeration.actions.approve} label="Resolve report" />
      <ActionIconButton icon={appIcons.contentModeration.actions.restrict} label="Restrict account" />
    </IconButtonGroup>
  )
}
