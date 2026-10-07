import { StatusBadge } from '../../../../shared/components/StatusBadge'
import { DataTable } from '../../../../shared/table/DataTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import { getPaginationLabel } from '../../../../shared/utils/pagination'
import type { ActivityRow } from '../../hooks/useUserActivity'
import type { QuickActionMenuItem } from './QuickActionDropdown'
import { UserIdentity, UserMobileCard } from './UserMobileCard'
import { UserTableActions } from './UserTableActions'

export type ActivityMoreAction = 'open-audit-trail' | 'export-event' | 'add-internal-note' | 'notify-operator'

type ActivityHistoryTableProps = {
  activities: ActivityRow[]
  onViewActivity: (activity: ActivityRow) => void
  onTrustReview: (activity: ActivityRow) => void
  onMoreAction: (activity: ActivityRow, action: ActivityMoreAction) => void
}

const activityMoreActionLabels: Array<{ action: ActivityMoreAction; label: string }> = [
  { action: 'open-audit-trail', label: 'Open audit trail' },
  { action: 'export-event', label: 'Export event' },
  { action: 'add-internal-note', label: 'Add internal note' },
  { action: 'notify-operator', label: 'Notify operator' },
]

export function ActivityHistoryTable({
  activities,
  onViewActivity,
  onTrustReview,
  onMoreAction,
}: ActivityHistoryTableProps) {
  function getMoreActions(row: ActivityRow): QuickActionMenuItem[] {
    return activityMoreActionLabels.map((item) => ({
      label: item.label,
      onSelect: () => onMoreAction(row, item.action),
    }))
  }

  const columns: Array<DataTableColumn<ActivityRow>> = [
    {
      key: 'user',
      header: 'Users',
      render: (row) => <UserIdentity name={row.user.name} date={row.date} avatar={row.user.avatar} />,
    },
    { key: 'recentAction', header: 'Recent action', render: (row) => row.recentAction },
    { key: 'trustEvent', header: 'Trust event', render: (row) => row.trustEvent },
    { key: 'planEvent', header: 'Plan event', render: (row) => row.planEvent },
    { key: 'lastActive', header: 'Last active', render: (row) => row.lastActive },
    { key: 'state', header: 'State', render: (row) => <StatusBadge status={row.state} /> },
    {
      key: 'actions',
      header: 'Quick actions',
      sortable: false,
      render: (row) => (
        <UserTableActions
          variant="activity"
          onView={() => onViewActivity(row)}
          onSecondary={() => onTrustReview(row)}
          moreActions={getMoreActions(row)}
        />
      ),
    },
  ]

  return (
    <DataTable
      items={activities}
      columns={columns}
      getKey={(row) => row.id}
      paginationLabel={getPaginationLabel(activities.length, 'events')}
      renderMobileCard={(row) => (
        <UserMobileCard
          key={row.id}
          title={row.user.name}
          subtitle={row.date}
          avatar={row.user.avatar}
          actions={
            <UserTableActions
              variant="activity"
              onView={() => onViewActivity(row)}
              onSecondary={() => onTrustReview(row)}
              moreActions={getMoreActions(row)}
            />
          }
          rows={[
            { label: 'Action', value: row.recentAction },
            { label: 'Trust', value: row.trustEvent },
            { label: 'Plan', value: row.planEvent },
            { label: 'State', value: <StatusBadge status={row.state} /> },
          ]}
        />
      )}
    />
  )
}
