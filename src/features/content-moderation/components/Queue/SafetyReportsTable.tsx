import type { CursorPagination } from '../../../../shared/hooks/useCursorPages'
import { DataTable } from '../../../../shared/table/DataTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import { formatRelative } from '../../../../shared/utils/formatDate'
import { humanize } from '../../../../shared/utils/humanize'
import { getPaginationLabel } from '../../../../shared/utils/pagination'
import { SeverityBadge } from '../SeverityBadge'
import type { ModerationReport } from '../../types/contentModeration.types'
import { ReportActions } from './ReportActions'
import { SafetyReportMobileCard, SourceTag } from './SafetyReportMobileCard'

type SafetyReportsTableProps = {
  reports: ModerationReport[]
  loading: boolean
  error: unknown
  onRetry: () => void
  pagination: CursorPagination
  onOpenCase: (report: ModerationReport) => void
}

export function SafetyReportsTable({ reports, loading, error, onRetry, pagination, onOpenCase }: SafetyReportsTableProps) {
  const columns: Array<DataTableColumn<ModerationReport>> = [
    {
      key: 'reported',
      header: 'Reported',
      sortable: false,
      render: (report) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">{report.reportedName}</p>
          <p className="truncate font-mono text-xs text-slate-500">{report.userId ? report.userId.slice(0, 8) : '—'}</p>
        </div>
      ),
    },
    { key: 'source', header: 'Source', sortable: false, render: (report) => <SourceTag report={report} /> },
    { key: 'reason', header: 'Reason', sortable: false, render: (report) => humanize(report.reason) },
    { key: 'mode', header: 'Mode', sortable: false, render: (report) => report.mode },
    { key: 'severity', header: 'Severity', sortable: false, render: (report) => <SeverityBadge severity={report.severity} /> },
    {
      key: 'status',
      header: 'Status',
      sortable: false,
      render: (report) => (
        <span className="grid gap-0.5">
          <span>{humanize(report.status)}</span>
          <span className="text-xs text-slate-400">{report.assignedToId ? 'Claimed' : 'Unassigned'}</span>
        </span>
      ),
    },
    { key: 'timestamp', header: 'Waiting', sortable: false, render: (report) => formatRelative(report.timestamp) },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (report) => <ReportActions onView={() => onOpenCase(report)} onResolve={() => onOpenCase(report)} />,
    },
  ]

  return (
    <DataTable
      items={reports}
      columns={columns}
      getKey={(report) => `${report.source}-${report.id}`}
      loading={loading}
      error={error}
      onRetry={onRetry}
      pagination={pagination}
      paginationLabel={getPaginationLabel(reports.length, 'cases')}
      emptyTitle="The queue is clear"
      emptyDescription="No cases match these filters."
      renderMobileCard={(report) => (
        <SafetyReportMobileCard key={`${report.source}-${report.id}`} report={report} onOpenCase={() => onOpenCase(report)} />
      )}
    />
  )
}
