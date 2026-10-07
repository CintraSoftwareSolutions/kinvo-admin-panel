import { EmptyState } from '../../../../shared/components/EmptyState'
import { SimpleTable } from '../../../../shared/table/SimpleTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import type { SubscriptionMixRow } from '../../types/analyticsDashboard.types'

type RenewalConfidenceTableProps = {
  rows: SubscriptionMixRow[]
}

/** Renewal evidence per plan, from the subscription mix series. No forecast is made. */
export function RenewalConfidenceTable({ rows }: RenewalConfidenceTableProps) {
  const columns: Array<DataTableColumn<SubscriptionMixRow>> = [
    {
      key: 'plan',
      header: 'Plan',
      render: (row) => <span className="font-semibold text-slate-950">{row.plan}</span>,
    },
    { key: 'renewed', header: 'Renewed', render: (row) => row.renewed },
    { key: 'churn', header: 'Lifetime churn', render: (row) => `${row.churn_percent}%` },
  ]

  if (rows.length === 0) {
    return <EmptyState className="mt-6" />
  }

  return <SimpleTable items={rows} columns={columns} getKey={(row) => row.plan} />
}
