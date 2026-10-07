import { useMemo } from 'react'
import { reportsMock } from '../data/reports.mock'
import type { ModerationReport } from '../types/contentModeration.types'

function matchesReport(report: ModerationReport, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return [report.reportedName, report.userId, report.reason, report.mode, report.severity].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  )
}

export function useModerationReports(query: string) {
  return useMemo(() => reportsMock.filter((report) => matchesReport(report, query)), [query])
}
