import type { ModerationReport } from '../types/contentModeration.types'

const baseReports = [
  {
    reportedName: 'David Kim',
    userId: 'User #12345',
    reason: 'Spam or Scam',
    mode: 'Trading',
    severity: 'High',
    timestamp: '6 mins ago',
  },
  {
    reportedName: 'Maya Rivera',
    userId: 'User #83481',
    reason: 'Boundary concern',
    mode: 'Cuddle',
    severity: 'Medium',
    timestamp: '28 mins ago',
  },
  {
    reportedName: 'Unknown profile',
    userId: 'User #73221',
    reason: 'Fake profile',
    mode: 'Dating',
    severity: 'Low',
    timestamp: '1h ago',
  },
] satisfies Array<Omit<ModerationReport, 'id'>>

export const reportsMock: ModerationReport[] = Array.from({ length: 10 }, (_, index) => {
  const report = baseReports[index % baseReports.length]
  return {
    ...report,
    id: `report-${index + 1}`,
  }
})
