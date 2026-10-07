export type ContentModerationTab = 'queue' | 'playbook' | 'escalations' | 'insights'

export type ReportSeverity = 'High' | 'Medium' | 'Low'

export type ModerationReport = {
  id: string
  reportedName: string
  userId: string
  reason: string
  mode: string
  severity: ReportSeverity
  timestamp: string
}

export type QueueHealthMetric = {
  label: string
  value: string
  description?: string
}

export type PriorityCase = {
  id: string
  name: string
  reason: string
  mode: string
  description: string
  severity: Exclude<ReportSeverity, 'Low'>
}

export type QueueOwner = {
  id: string
  name: string
  location: string
  lane: string
  badge: string
}

export type WeeklyReportLoad = {
  week: string
  reports: number
  resolved: number
}

export type ReportedCategory = {
  reason: string
  cases: number
}
