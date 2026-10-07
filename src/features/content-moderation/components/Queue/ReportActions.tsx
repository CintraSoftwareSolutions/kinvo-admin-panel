import { ActionIconButton } from '../../../../shared/components/ActionIconButton'
import { IconButtonGroup } from '../../../../shared/components/IconButtonGroup'
import { appIcons } from '../../../../shared/icons/appIcons'

type ReportActionsProps = {
  onView: () => void
  onResolve: () => void
  resolveDisabled?: boolean
  resolveTitle?: string
}

export function ReportActions({ onView, onResolve, resolveDisabled, resolveTitle }: ReportActionsProps) {
  return (
    <IconButtonGroup>
      <ActionIconButton icon={appIcons.contentModeration.actions.view} label="View case" onClick={onView} />
      <ActionIconButton
        icon={appIcons.contentModeration.actions.approve}
        label={resolveTitle ?? 'Resolve case'}
        onClick={onResolve}
        disabled={resolveDisabled}
      />
    </IconButtonGroup>
  )
}
