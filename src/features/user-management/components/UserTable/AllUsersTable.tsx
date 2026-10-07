import { RiskBadge } from '../../../../shared/components/RiskBadge'
import { StatusBadge } from '../../../../shared/components/StatusBadge'
import type { CursorPagination } from '../../../../shared/hooks/useCursorPages'
import { DataTable } from '../../../../shared/table/DataTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import { formatDate, formatRelative } from '../../../../shared/utils/formatDate'
import { getPaginationLabel } from '../../../../shared/utils/pagination'
import type { User } from '../../types/userManagement.types'
import type { QuickActionMenuItem } from './QuickActionDropdown'
import { UserIdentity, UserMobileCard } from './UserMobileCard'
import { UserTableActions } from './UserTableActions'

type AllUsersTableProps = {
  users: User[]
  loading: boolean
  error: unknown
  onRetry: () => void
  pagination: CursorPagination
  onViewUser: (user: User) => void
  onAccountAction: (user: User) => void
  onChangeRole: (user: User) => void
}

export function AllUsersTable({
  users,
  loading,
  error,
  onRetry,
  pagination,
  onViewUser,
  onAccountAction,
  onChangeRole,
}: AllUsersTableProps) {
  function getMoreActions(user: User): QuickActionMenuItem[] {
    return [
      { label: 'View details', onSelect: () => onViewUser(user) },
      {
        label: user.account_status === 'suspended' ? 'Reinstate account' : 'Suspend account',
        tone: user.account_status === 'suspended' ? undefined : 'danger',
        onSelect: () => onAccountAction(user),
      },
      { label: 'Change staff role', onSelect: () => onChangeRole(user) },
    ]
  }

  function renderActions(user: User) {
    return (
      <UserTableActions
        onView={() => onViewUser(user)}
        onSecondary={() => onAccountAction(user)}
        secondaryLabel={user.account_status === 'suspended' ? 'Reinstate account' : 'Suspend account'}
        moreActions={getMoreActions(user)}
      />
    )
  }

  const columns: Array<DataTableColumn<User>> = [
    {
      key: 'user',
      header: 'Users',
      sortable: false,
      render: (user) => <UserIdentity name={user.name} email={user.email ?? undefined} avatar={user.avatar ?? undefined} />,
    },
    { key: 'joinDate', header: 'Join date', sortable: false, render: (user) => formatDate(user.joinDate) },
    { key: 'plan', header: 'Subscription plan', sortable: false, render: (user) => <PlanCell user={user} /> },
    { key: 'lastActive', header: 'Last active', sortable: false, render: (user) => formatRelative(user.lastActive) },
    { key: 'mode', header: 'Mode focus', sortable: false, render: (user) => user.mode },
    {
      key: 'status',
      header: 'Status',
      sortable: false,
      render: (user) => (
        <div className="grid gap-1">
          <StatusBadge status={user.status} />
          <RiskBadge risk={user.risk} />
          <HonestFields user={user} />
        </div>
      ),
    },
    { key: 'actions', header: 'Quick actions', sortable: false, render: renderActions },
  ]

  return (
    <DataTable
      items={users}
      columns={columns}
      getKey={(user) => user.id}
      loading={loading}
      error={error}
      onRetry={onRetry}
      pagination={pagination}
      paginationLabel={getPaginationLabel(users.length, 'members')}
      emptyTitle="No users match"
      emptyDescription="Try a different search or clear the filters."
      renderMobileCard={(user) => (
        <UserMobileCard
          key={user.id}
          title={user.name}
          subtitle={user.email ?? undefined}
          avatar={user.avatar ?? undefined}
          actions={renderActions(user)}
          rows={[
            { label: 'Plan', value: <PlanCell user={user} /> },
            { label: 'Active', value: formatRelative(user.lastActive) },
            { label: 'Mode', value: user.mode },
            {
              label: 'State',
              value: (
                <span className="inline-flex flex-col items-end gap-1">
                  <StatusBadge status={user.status} />
                  <RiskBadge risk={user.risk} />
                  <HonestFields user={user} />
                </span>
              ),
            },
          ]}
        />
      )}
    />
  )
}

function PlanCell({ user }: { user: User }) {
  return (
    <span className="grid gap-0.5">
      <span>{user.plan}</span>
      <span className="text-xs text-slate-400">tier: {user.tier}</span>
    </span>
  )
}

/** The real fields the collapsed status label was derived from. */
export function HonestFields({ user }: { user: User }) {
  const parts = [
    user.account_status,
    user.is_verified ? 'verified' : 'unverified',
    user.is_flagged ? 'flagged' : null,
    user.staff_role !== 'user' ? user.staff_role : null,
  ].filter(Boolean)

  return (
    <span className="text-[11px] font-medium text-slate-400" title="Account status, verification, flag and staff role">
      {parts.join(' · ')}
    </span>
  )
}
