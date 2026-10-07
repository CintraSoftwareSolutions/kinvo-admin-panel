import { EmptyState } from '../../../../shared/components/EmptyState'
import { SimpleTable } from '../../../../shared/table/SimpleTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import { cn } from '../../../../shared/utils/cn'
import { formatNumber } from '../../../../shared/utils/formatNumber'
import type { ModePerformanceRow } from '../../types/analyticsDashboard.types'

type ModePerformanceTableProps = {
  rows: ModePerformanceRow[]
}

function TrustScoreBadge({ score }: { score: ModePerformanceRow['trustScore'] }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        score === 'High' && 'bg-emerald-100 text-emerald-800',
        score === 'Medium' && 'bg-orange-100 text-orange-700',
        score === 'Low' && 'bg-rose-100 text-rose-700',
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
    { key: 'activeUsers', header: 'Users with mode', render: (row) => formatNumber(row.activeUsers) },
    { key: 'completion', header: 'Onboarded & active', render: (row) => `${row.completion_percent}%` },
    { key: 'trustScore', header: 'Trust score', render: (row) => <TrustScoreBadge score={row.trustScore} /> },
  ]

  if (rows.length === 0) {
    return <EmptyState className="mt-6" />
  }

  return <SimpleTable items={rows} columns={columns} getKey={(row) => row.mode} />
}
