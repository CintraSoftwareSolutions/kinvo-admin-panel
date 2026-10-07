import { DataTable } from '../../../../shared/table/DataTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import { SeverityBadge } from '../SeverityBadge'
import type { ModerationReport } from '../../types/contentModeration.types'
import { ReportActions } from './ReportActions'
import { SafetyReportMobileCard } from './SafetyReportMobileCard'

type SafetyReportsTableProps = {
  reports: ModerationReport[]
}

export function SafetyReportsTable({ reports }: SafetyReportsTableProps) {
  const columns: Array<DataTableColumn<ModerationReport>> = [
    {
      key: 'reported',
      header: 'Reported',
      render: (report) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">{report.reportedName}</p>
          <p className="truncate text-xs text-slate-500">{report.userId}</p>
        </div>
      ),
    },
    { key: 'reason', header: 'Reason', render: (report) => report.reason },
    { key: 'mode', header: 'Mode', render: (report) => report.mode },
    { key: 'severity', header: 'Severity', render: (report) => <SeverityBadge severity={report.severity} /> },
    { key: 'timestamp', header: 'Timestamp', render: (report) => report.timestamp },
    { key: 'actions', header: 'Actions', sortable: false, render: () => <ReportActions /> },
  ]

  return (
    <DataTable
      items={reports}
      columns={columns}
      getKey={(report) => report.id}
      paginationLabel="1-3 of 3 cases"
      renderMobileCard={(report) => <SafetyReportMobileCard key={report.id} report={report} />}
    />
  )
}
