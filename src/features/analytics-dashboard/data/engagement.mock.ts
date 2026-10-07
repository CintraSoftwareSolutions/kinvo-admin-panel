import type { EngagementPoint, WeeklyResolutionPoint } from '../types/analyticsDashboard.types'

export const engagementMock: EngagementPoint[] = [
  { month: 'Jan', activeUsers: 4200, verifiedUsers: 2000 },
  { month: 'Feb', activeUsers: 4900, verifiedUsers: 2400 },
  { month: 'Mar', activeUsers: 5500, verifiedUsers: 3100 },
  { month: 'Apr', activeUsers: 5300, verifiedUsers: 3300 },
  { month: 'May', activeUsers: 6100, verifiedUsers: 3700 },
  { month: 'Jun', activeUsers: 6700, verifiedUsers: 4200 },
  { month: 'Jul', activeUsers: 6500, verifiedUsers: 4400 },
]

export const weeklyResolutionMock: WeeklyResolutionPoint[] = [
  { week: 'Week 1', reported: 18, resolved: 15 },
  { week: 'Week 2', reported: 22, resolved: 19 },
  { week: 'Week 3', reported: 17, resolved: 21 },
  { week: 'Week 4', reported: 24, resolved: 22 },
]
