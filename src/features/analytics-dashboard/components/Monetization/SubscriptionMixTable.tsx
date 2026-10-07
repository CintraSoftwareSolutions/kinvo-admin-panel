import { SimpleTable } from '../../../../shared/table/SimpleTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import type { SubscriptionMixRow } from '../../types/analyticsDashboard.types'

type SubscriptionMixTableProps = {
  rows: SubscriptionMixRow[]
}

export function SubscriptionMixTable({ rows }: SubscriptionMixTableProps) {
  const columns: Array<DataTableColumn<SubscriptionMixRow>> = [
    {
      key: 'plan',
      header: 'Plan',
      render: (row) => <span className="font-semibold text-slate-950">{row.plan}</span>,
    },
    { key: 'active', header: 'Active', render: (row) => row.active },
    { key: 'renewed', header: 'Renewed', render: (row) => row.renewed },
    { key: 'churn', header: 'Churn', render: (row) => row.churn },
  ]

  return <SimpleTable items={rows} columns={columns} getKey={(row) => row.plan} />
}
