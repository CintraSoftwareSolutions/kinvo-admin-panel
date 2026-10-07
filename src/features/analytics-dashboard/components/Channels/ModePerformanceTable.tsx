import { SimpleTable } from '../../../../shared/table/SimpleTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import { cn } from '../../../../shared/utils/cn'
import type { ModePerformanceRow } from '../../types/analyticsDashboard.types'

type ModePerformanceTableProps = {
  rows: ModePerformanceRow[]
}

function TrustScoreBadge({ score }: { score: ModePerformanceRow['trustScore'] }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        score === 'High' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-700',
      )}
    >
      {score}
    </span>
  )
}

export function ModePerformanceTable({ rows }: ModePerformanceTableProps) {
  const columns: Array<DataTableColumn<ModePerformanceRow>> = [
    {
      key: 'mode',
      header: 'Mode',
      render: (row) => <span className="font-semibold text-slate-950">{row.mode}</span>,
    },
    { key: 'activeUsers', header: 'Active users', render: (row) => row.activeUsers },
    { key: 'completion', header: 'Completion', render: (row) => row.completion },
    { key: 'trustScore', header: 'Trust score', render: (row) => <TrustScoreBadge score={row.trustScore} /> },
  ]

  return <SimpleTable items={rows} columns={columns} getKey={(row) => row.mode} />
}
