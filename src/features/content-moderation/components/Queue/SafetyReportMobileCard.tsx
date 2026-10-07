import { SeverityBadge } from '../SeverityBadge'
import type { ModerationReport } from '../../types/contentModeration.types'
import { ReportActions } from './ReportActions'

type SafetyReportMobileCardProps = {
  report: ModerationReport
}

export function SafetyReportMobileCard({ report }: SafetyReportMobileCardProps) {
  return (
    <article className="rounded-2xl border border-slate-300 bg-white p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">{report.reportedName}</p>
          <p className="truncate text-xs text-slate-500">{report.userId}</p>
        </div>
        <ReportActions />
      </div>
      <div className="grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Reason</span>
          <span className="text-right text-slate-700">{report.reason}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Mode</span>
          <span className="text-right text-slate-700">{report.mode}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Severity</span>
          <SeverityBadge severity={report.severity} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Timestamp</span>
          <span className="text-right text-slate-700">{report.timestamp}</span>
        </div>
      </div>
    </article>
  )
}
