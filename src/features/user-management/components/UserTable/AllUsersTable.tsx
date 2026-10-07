import { RiskBadge } from '../../../../shared/components/RiskBadge'
import { StatusBadge } from '../../../../shared/components/StatusBadge'
import { DataTable } from '../../../../shared/table/DataTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import { getPaginationLabel } from '../../../../shared/utils/pagination'
import type { User } from '../../types/userManagement.types'
import type { QuickActionMenuItem } from './QuickActionDropdown'
import { UserIdentity, UserMobileCard } from './UserMobileCard'
import { UserTableActions } from './UserTableActions'

export type UserMoreAction = 'edit-user' | 'send-notification' | 'export-user-data' | 'remove-user'

type AllUsersTableProps = {
  users: User[]
  onViewUser: (user: User) => void
  onAccountAction: (user: User) => void
  onMoreAction: (user: User, action: UserMoreAction) => void
}

const userMoreActionLabels: Array<{ action: UserMoreAction; label: string; tone?: QuickActionMenuItem['tone'] }> = [
  { action: 'edit-user', label: 'Edit user' },
  { action: 'send-notification', label: 'Send notification' },
  { action: 'export-user-data', label: 'Export user data' },
  { action: 'remove-user', label: 'Remove user', tone: 'danger' },
]

export function AllUsersTable({ users, onViewUser, onAccountAction, onMoreAction }: AllUsersTableProps) {
  function getMoreActions(user: User): QuickActionMenuItem[] {
    return userMoreActionLabels.map((item) => ({
      label: item.label,
      tone: item.tone,
      onSelect: () => onMoreAction(user, item.action),
    }))
  }

  const columns: Array<DataTableColumn<User>> = [
    {
      key: 'user',
      header: 'Users',
      render: (user) => <UserIdentity name={user.name} email={user.email} avatar={user.avatar} />,
    },
    { key: 'joinDate', header: 'Join date', render: (user) => user.joinDate },
    { key: 'plan', header: 'Subscription plan', render: (user) => user.plan },
    { key: 'lastActive', header: 'Last active', render: (user) => user.lastActive },
    { key: 'mode', header: 'Mode focus', render: (user) => user.mode },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <div className="grid gap-1">
          <StatusBadge status={user.status} />
          <RiskBadge risk={user.risk} />
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Quick actions',
      sortable: false,
      render: (user) => (
        <UserTableActions
          onView={() => onViewUser(user)}
          onSecondary={() => onAccountAction(user)}
          moreActions={getMoreActions(user)}
        />
      ),
    },
  ]

  return (
    <DataTable
      items={users}
      columns={columns}
      getKey={(user) => user.id}
      selectable
      paginationLabel={getPaginationLabel(users.length, 'members')}
      renderMobileCard={(user) => (
        <UserMobileCard
          key={user.id}
          title={user.name}
          subtitle={user.email}
          avatar={user.avatar}
          actions={
            <UserTableActions
              onView={() => onViewUser(user)}
              onSecondary={() => onAccountAction(user)}
              moreActions={getMoreActions(user)}
            />
          }
          rows={[
            { label: 'Plan', value: user.plan },
            { label: 'Active', value: user.lastActive },
            { label: 'Mode', value: user.mode },
            {
              label: 'State',
              value: (
                <span className="inline-flex flex-col items-end gap-1">
                  <StatusBadge status={user.status} />
                  <RiskBadge risk={user.risk} />
                </span>
              ),
            },
          ]}
        />
      )}
    />
  )
}
