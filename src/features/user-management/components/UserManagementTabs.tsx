import { PillTabs } from '../../../shared/components/PillTabs'
import { appIcons } from '../../../shared/icons/appIcons'
import type { TopUserManagementTab } from '../types/userManagement.types'

type UserManagementTabsProps = {
  activeTab: TopUserManagementTab
  onChange: (tab: TopUserManagementTab) => void
}

const tabs = [
  { value: 'user-table', label: 'User table', icon: appIcons.userManagement.userTable },
  { value: 'snapshot', label: 'Snapshot', icon: appIcons.userManagement.snapshot },
  { value: 'roles-rights', label: 'Roles & rights', icon: appIcons.userManagement.roles },
  { value: 'operator-guide', label: 'Operator guide', icon: appIcons.userManagement.operatorGuide },
] satisfies Array<{ value: TopUserManagementTab; label: string; icon: typeof appIcons.userManagement.userTable }>

export function UserManagementTabs({ activeTab, onChange }: UserManagementTabsProps) {
  return <PillTabs tabs={tabs} activeTab={activeTab} onChange={onChange} />
}
