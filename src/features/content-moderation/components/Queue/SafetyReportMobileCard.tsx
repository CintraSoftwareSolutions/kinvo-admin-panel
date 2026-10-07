import { formatRelative } from '../../../../shared/utils/formatDate'
import { humanize } from '../../../../shared/utils/humanize'
import { SeverityBadge } from '../SeverityBadge'
import type { ModerationReport } from '../../types/contentModeration.types'
import { ReportActions } from './ReportActions'

type SafetyReportMobileCardProps = {
  report: ModerationReport
  onOpenCase: () => void
}

export function SourceTag({ report }: { report: ModerationReport }) {
  return (
    <span className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
      {report.source === 'report' ? 'Report' : 'Flag'}
      {report.contextType ? ` · ${report.contextType}` : ''}
    </span>
  )
}

export function SafetyReportMobileCard({ report, onOpenCase }: SafetyReportMobileCardProps) {
  const rows = [
    { label: 'Source', value: <SourceTag report={report} /> },
    { label: 'Reason', value: humanize(report.reason) },
    { label: 'Mode', value: report.mode },
    { label: 'Severity', value: <SeverityBadge severity={report.severity} /> },
    { label: 'Status', value: `${humanize(report.status)}${report.assignedToId ? ' · claimed' : ''}` },
    { label: 'Waiting', value: formatRelative(report.timestamp) },
  ]

  return (
    <article className="rounded-2xl border border-slate-300 bg-white p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">{report.reportedName}</p>
          <p className="truncate font-mono text-xs text-slate-500">{report.userId ? report.userId.slice(0, 8) : '—'}</p>
        </div>
        <ReportActions onView={onOpenCase} onResolve={onOpenCase} />
      </div>
      <div className="grid gap-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{row.label}</span>
            <span className="text-right text-slate-700">{row.value}</span>
          </div>
        ))}
      </div>
    </article>
  )
}
