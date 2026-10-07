import { SimpleTable } from '../../../../shared/table/SimpleTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import type { RenewalConfidenceRow } from '../../types/analyticsDashboard.types'

type RenewalConfidenceTableProps = {
  rows: RenewalConfidenceRow[]
}

export function RenewalConfidenceTable({ rows }: RenewalConfidenceTableProps) {
  const columns: Array<DataTableColumn<RenewalConfidenceRow>> = [
    {
      key: 'plan',
      header: 'Plan',
      render: (row) => <span className="font-semibold text-slate-950">{row.plan}</span>,
    },
    { key: 'renewed', header: 'Renewed', render: (row) => row.renewed },
    { key: 'churn', header: 'Churn', render: (row) => row.churn },
  ]

  return <SimpleTable items={rows} columns={columns} getKey={(row) => row.plan} />
}
