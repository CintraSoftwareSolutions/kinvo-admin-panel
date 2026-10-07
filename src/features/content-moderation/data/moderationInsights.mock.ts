import type { ReportedCategory, WeeklyReportLoad } from '../types/contentModeration.types'

export const weeklyReportLoadMock: WeeklyReportLoad[] = [
  { week: 'Week 1', reports: 18, resolved: 15 },
  { week: 'Week 2', reports: 22, resolved: 19 },
  { week: 'Week 3', reports: 17, resolved: 21 },
  { week: 'Week 4', reports: 24, resolved: 22 },
]

export const reportedCategoriesMock: ReportedCategory[] = [
  { reason: 'Spam or Scam', cases: 1 },
  { reason: 'Boundary concern', cases: 1 },
  { reason: 'Fake profile', cases: 1 },
]
