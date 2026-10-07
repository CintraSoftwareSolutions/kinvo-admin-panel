import type { ReactNode } from 'react'
import { useState } from 'react'
import { useAuth } from '../../../auth/hooks/useAuth'
import { useActionGate } from '../../../auth/hooks/usePermissions'
import { InlineError } from '../../../../shared/components/InlineError'
import { Modal } from '../../../../shared/components/Modal'
import { Textarea } from '../../../../shared/forms/Textarea'
import { formatDateTime } from '../../../../shared/utils/formatDate'
import { humanize } from '../../../../shared/utils/humanize'
import {
  isAlreadyReviewed,
  useAssignFlag,
  useEscalations,
  useResolveCase,
  type Resolution,
} from '../../api/contentModeration.api'
import type { ModerationReport } from '../../types/contentModeration.types'
import { SeverityBadge } from '../SeverityBadge'
import { SourceTag } from './SafetyReportMobileCard'

const resolutionOptions: Array<{ value: Resolution; label: string; description: string }> = [
  { value: 'under_review', label: 'Mark under review', description: 'Keep the case open while you investigate.' },
  { value: 'actioned', label: 'Action', description: 'Uphold the case. The server records the decision and notifies.' },
  { value: 'dismissed', label: 'Dismiss', description: 'No violation found.' },
]

type CaseModalProps = {
  report: ModerationReport | null
  onClose: () => void
}

export function CaseModal({ report, onClose }: CaseModalProps) {
  return (
    <Modal open={Boolean(report)} title="Case review" onClose={onClose}>
      {report ? <CaseBody key={`${report.source}-${report.id}`} report={report} onClose={onClose} /> : null}
    </Modal>
  )
}

function CaseBody({ report, onClose }: { report: ModerationReport; onClose: () => void }) {
  const { me } = useAuth()
  const [resolution, setResolution] = useState<Resolution>('actioned')
  const [note, setNote] = useState('')
  const resolve = useResolveCase()
  const assign = useAssignFlag()
  const escalations = useEscalations()
  const gate = useActionGate()('moderation.resolve')
  // The queue list omits descriptions by design; escalations carry them for High/Medium cases.
  const description = escalations.data?.find((item) => item.id === report.id && item.source === report.source)?.description
  const isMine = Boolean(me && report.assignedToId === me.id)
  const alreadyReviewed = isAlreadyReviewed(resolve.error)

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <Line label="Reported" value={report.reportedName} />
        <Line label="Source" value={<SourceTag report={report} />} />
        <Line label="Reason" value={humanize(report.reason)} />
        <Line label="Mode" value={report.mode} />
        <Line label="Severity" value={<SeverityBadge severity={report.severity} />} />
        <Line label="Status" value={humanize(report.status)} />
        <Line label="Raised" value={formatDateTime(report.timestamp)} />
        <Line label="Owner" value={report.assignedToId ? (isMine ? 'You' : 'Another operator') : 'Unassigned'} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Reporter’s description</p>
        <p className="mt-2 leading-6 text-slate-700">
          {description ?? (report.severity === 'Low' ? 'Not available for Low-severity cases in this panel.' : 'None given.')}
        </p>
        <p className="mt-3 text-xs leading-5 text-slate-400">
          Message content is never shown here: no endpoint returns a message anybody sent.
        </p>
      </div>

      {report.source === 'flag' ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3">
          <span className="text-sm font-semibold text-slate-700">Ownership</span>
          <button
            type="button"
            disabled={!gate.allowed || assign.isPending || !me || (Boolean(report.assignedToId) && !isMine)}
            title={gate.reason}
            onClick={() => assign.mutate({ flagId: report.id, assigneeId: isMine ? null : (me?.id ?? null) }, { onSuccess: onClose })}
            className="h-9 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition enabled:hover:border-violet-300 enabled:hover:text-violet-700 disabled:opacity-50"
          >
            {isMine ? 'Release' : 'Claim'}
          </button>
        </div>
      ) : null}
      <InlineError error={assign.error} />

      <div className="grid gap-2">
        {resolutionOptions.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-violet-300 hover:bg-violet-50/40"
          >
            <input
              type="radio"
              checked={resolution === option.value}
              onChange={() => setResolution(option.value)}
              className="mt-1 h-4 w-4 border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-950">{option.label}</span>
              <span className="mt-1 block text-xs text-slate-500">{option.description}</span>
            </span>
          </label>
        ))}
      </div>
      {report.source === 'report' ? (
        <Textarea
          label="Resolution note (optional)"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="What you found and why you decided this"
        />
      ) : null}

      {alreadyReviewed ? (
        <div role="status" className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          Another moderator already reviewed this case. The queue has been refreshed.
        </div>
      ) : (
        <InlineError error={resolve.error} />
      )}

      <div className="flex flex-wrap justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="h-11 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700"
        >
          {alreadyReviewed ? 'Close' : 'Cancel'}
        </button>
        {!alreadyReviewed ? (
          <button
            type="button"
            disabled={!gate.allowed || resolve.isPending}
            title={gate.reason}
            onClick={() => resolve.mutate({ item: report, status: resolution, note: note.trim() }, { onSuccess: onClose })}
            className="h-11 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(111,61,204,0.26)] transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300 disabled:shadow-none"
          >
            {resolve.isPending ? 'Saving…' : 'Save decision'}
          </button>
        ) : null}
      </div>
    </div>
  )
}

function Line({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-950">{value}</span>
    </div>
  )
}
