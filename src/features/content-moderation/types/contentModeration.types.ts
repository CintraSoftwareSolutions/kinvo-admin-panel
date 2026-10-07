export type ContentModerationTab = 'queue' | 'verification' | 'escalations' | 'insights'

/** Three values collapsed from the server's five; critical folds upward into High. */
export type ReportSeverity = 'High' | 'Medium' | 'Low'

export type QueueStatus = 'open' | 'under_review' | 'actioned' | 'dismissed'

/** Row of GET /admin/moderation/queue — reports and flags merged. No description by design. */
export type ModerationReport = {
  id: string
  source: 'report' | 'flag'
  reportedName: string
  userId: string | null
  avatar: string | null
  reason: string
  mode: string
  severity: ReportSeverity
  timestamp: string
  status: QueueStatus
  assignedToId: string | null
  contextType: string | null
}

/** Item of GET /admin/moderation/escalations — High/Medium only, severity-ordered, with description. */
export type PriorityCase = {
  id: string
  source: 'report' | 'flag'
  name: string
  userId: string | null
  reason: string
  mode: string
  description: string | null
  severity: Exclude<ReportSeverity, 'Low'>
  createdAt: string
}

export type QueueHealthMetric = {
  label: string
  value: string
  description?: string | null
}

export type QueueOwner = {
  id: string
  name: string
  location?: string | null
  lane?: string | null
  badge?: string | null
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

/** GET /admin/moderation/insights */
export type ModerationInsights = {
  queueHealth: QueueHealthMetric[]
  weeklyLoad: WeeklyReportLoad[]
  reportedCategories: ReportedCategory[]
  owners: QueueOwner[]
}

/** Row of GET /verification/review */
export type VerificationSubmission = {
  id: string
  status: string
  method: 'photo' | 'government_id' | 'social'
  submitted_at: string | null
  created_at: string
  user: { id: string; display_name: string | null; primary_photo_url: string | null; is_verified: boolean }
  document_url: string | null
  social_provider: string | null
}
