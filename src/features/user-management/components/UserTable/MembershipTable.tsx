import { StatusBadge } from '../../../../shared/components/StatusBadge'
import { DataTable } from '../../../../shared/table/DataTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import { getPaginationLabel } from '../../../../shared/utils/pagination'
import type { MembershipRow } from '../../hooks/useUserMemberships'
import type { QuickActionMenuItem } from './QuickActionDropdown'
import { UserIdentity, UserMobileCard } from './UserMobileCard'
import { UserTableActions } from './UserTableActions'

export type MembershipMoreAction = 'view-invoice' | 'apply-promo' | 'send-payment-reminder' | 'export-billing-record'

type MembershipTableProps = {
  memberships: MembershipRow[]
  onViewMembership: (membership: MembershipRow) => void
  onBillingAction: (membership: MembershipRow) => void
  onMoreAction: (membership: MembershipRow, action: MembershipMoreAction) => void
}

const membershipMoreActionLabels: Array<{ action: MembershipMoreAction; label: string }> = [
  { action: 'view-invoice', label: 'View invoice' },
  { action: 'apply-promo', label: 'Apply promo' },
  { action: 'send-payment-reminder', label: 'Send payment reminder' },
  { action: 'export-billing-record', label: 'Export billing record' },
]

export function MembershipTable({
  memberships,
  onViewMembership,
  onBillingAction,
  onMoreAction,
}: MembershipTableProps) {
  function getMoreActions(row: MembershipRow): QuickActionMenuItem[] {
    return membershipMoreActionLabels.map((item) => ({
      label: item.label,
      onSelect: () => onMoreAction(row, item.action),
    }))
  }

  const columns: Array<DataTableColumn<MembershipRow>> = [
    {
      key: 'user',
      header: 'Users',
      render: (row) => <UserIdentity name={row.user.name} email={row.user.email} avatar={row.user.avatar} />,
    },
    { key: 'startDate', header: 'Start date', render: (row) => row.startDate },
    { key: 'subscriptionPlan', header: 'Subscription plan', render: (row) => row.subscriptionPlan },
    { key: 'renewalDate', header: 'Renewal date', render: (row) => row.renewalDate },
    { key: 'paymentMethod', header: 'Payment method', render: (row) => row.paymentMethod },
    { key: 'paymentStatus', header: 'Payment status', render: (row) => <StatusBadge status={row.paymentStatus} /> },
    {
      key: 'actions',
      header: 'Quick actions',
      sortable: false,
      render: (row) => (
        <UserTableActions
          variant="membership"
          onView={() => onViewMembership(row)}
          onSecondary={() => onBillingAction(row)}
          moreActions={getMoreActions(row)}
        />
      ),
    },
  ]

  return (
    <DataTable
      items={memberships}
      columns={columns}
      getKey={(row) => row.id}
      paginationLabel={getPaginationLabel(memberships.length, 'members')}
      renderMobileCard={(row) => (
        <UserMobileCard
          key={row.id}
          title={row.user.name}
          subtitle={row.user.email}
          avatar={row.user.avatar}
          actions={
            <UserTableActions
              variant="membership"
              onView={() => onViewMembership(row)}
              onSecondary={() => onBillingAction(row)}
              moreActions={getMoreActions(row)}
            />
          }
          rows={[
            { label: 'Plan', value: row.subscriptionPlan },
            { label: 'Renewal', value: row.renewalDate },
            { label: 'Method', value: row.paymentMethod },
            { label: 'Status', value: <StatusBadge status={row.paymentStatus} /> },
          ]}
        />
      )}
    />
  )
}
