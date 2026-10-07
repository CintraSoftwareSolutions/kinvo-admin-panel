import { useCursorPages } from '../../../shared/hooks/useCursorPages'
import { moderationKeys } from '../api/contentModeration.api'
import type { ModerationReport, QueueStatus, ReportSeverity, VerificationSubmission } from '../types/contentModeration.types'

export type QueueFilters = {
  status: QueueStatus | ''
  severity: ReportSeverity | ''
  unassigned: boolean
}

function matchesReport(report: ModerationReport, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return [report.reportedName, report.userId ?? '', report.reason, report.mode, report.severity, report.source].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  )
}

/**
 * GET /admin/moderation/queue — oldest first, since a queue is work to get through.
 * The endpoint has no text search, so the topbar query filters the loaded page only.
 */
export function useModerationReports(query: string, filters: QueueFilters) {
  const pages = useCursorPages<ModerationReport>({
    queryKey: moderationKeys.queue,
    path: '/admin/moderation/queue',
    params: {
      status: filters.status || undefined,
      severity: filters.severity || undefined,
      unassigned: filters.unassigned || undefined,
    },
  })

  return { ...pages, items: pages.items.filter((report) => matchesReport(report, query)) }
}

export function useVerificationQueue() {
  return useCursorPages<VerificationSubmission>({
    queryKey: moderationKeys.verification,
    path: '/verification/review',
  })
}
