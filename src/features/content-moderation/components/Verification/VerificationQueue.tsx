import { useState } from 'react'
import { useActionGate } from '../../../auth/hooks/usePermissions'
import { ErrorState } from '../../../../shared/components/ErrorState'
import { EmptyState } from '../../../../shared/components/EmptyState'
import { InlineError } from '../../../../shared/components/InlineError'
import { Skeleton } from '../../../../shared/components/Skeleton'
import { DataTablePagination } from '../../../../shared/table/DataTablePagination'
import { formatRelative } from '../../../../shared/utils/formatDate'
import { humanize } from '../../../../shared/utils/humanize'
import { getPaginationLabel } from '../../../../shared/utils/pagination'
import { UserAvatar } from '../../../user-management/components/UserTable/UserMobileCard'
import { isAlreadyReviewed, useReviewVerification } from '../../api/contentModeration.api'
import { useVerificationQueue } from '../../hooks/useModerationReports'
import type { VerificationSubmission } from '../../types/contentModeration.types'

/** GET /verification/review — decisions go through POST /verification/{id}/review. */
export function VerificationQueue() {
  const queue = useVerificationQueue()

  if (queue.isLoading) return <Skeleton className="h-60 rounded-[24px]" />
  if (queue.error) return <ErrorState error={queue.error} onRetry={() => void queue.refetch()} />
  if (queue.items.length === 0 && !queue.pagination.hasPrevious) {
    return <EmptyState title="No submissions waiting" description="Verification requests appear here oldest first." />
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-300 bg-white">
      <div className="grid gap-3 p-3">
        {queue.items.map((submission) => (
          <SubmissionRow key={submission.id} submission={submission} />
        ))}
      </div>
      <DataTablePagination label={getPaginationLabel(queue.items.length, 'submissions')} pagination={queue.pagination} />
    </div>
  )
}

function SubmissionRow({ submission }: { submission: VerificationSubmission }) {
  const [reason, setReason] = useState('')
  const review = useReviewVerification()
  const gate = useActionGate()('verification.review')
  const name = submission.user.display_name ?? 'Unnamed member'
  const alreadyReviewed = isAlreadyReviewed(review.error)

  return (
    <article className="grid gap-3 rounded-2xl border border-slate-300 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name={name} avatar={submission.user.primary_photo_url ?? undefined} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">{name}</p>
            <p className="text-xs text-slate-500">
              {humanize(submission.method)}
              {submission.social_provider ? ` · ${submission.social_provider}` : ''} · submitted{' '}
              {formatRelative(submission.submitted_at ?? submission.created_at)}
            </p>
          </div>
        </div>
        {submission.document_url ? (
          <a
            href={submission.document_url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-9 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-violet-700 transition hover:border-violet-300"
          >
            Open document
          </a>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Reason (shown to the member if rejected)"
          aria-label="Review reason"
          className="h-10 min-w-0 flex-1 rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        />
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!gate.allowed || review.isPending || alreadyReviewed}
            title={gate.reason}
            onClick={() => review.mutate({ id: submission.id, approve: false, reason: reason.trim() })}
            className="h-10 rounded-full border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-600 transition enabled:hover:bg-rose-50 disabled:opacity-50"
          >
            Reject
          </button>
          <button
            type="button"
            disabled={!gate.allowed || review.isPending || alreadyReviewed}
            title={gate.reason}
            onClick={() => review.mutate({ id: submission.id, approve: true, reason: reason.trim() })}
            className="h-10 rounded-full bg-violet-600 px-4 text-sm font-semibold text-white transition enabled:hover:bg-violet-700 disabled:bg-violet-300"
          >
            Approve
          </button>
        </div>
      </div>
      {alreadyReviewed ? (
        <p role="status" className="text-sm font-medium text-blue-800">
          Another reviewer already decided this one. The list has been refreshed.
        </p>
      ) : (
        <InlineError error={review.error} />
      )}
    </article>
  )
}
