import type { AcquisitionMetric, ModePerformanceRow } from '../types/analyticsDashboard.types'

export const modePerformanceMock: ModePerformanceRow[] = [
  { mode: 'Dating', activeUsers: '18.4k', completion: '82%', trustScore: 'High' },
  { mode: 'Networking', activeUsers: '9.2k', completion: '74%', trustScore: 'High' },
  { mode: 'Foodie', activeUsers: '6.8k', completion: '79%', trustScore: 'Medium' },
  { mode: 'Study Buddy', activeUsers: '5.4k', completion: '72%', trustScore: 'Medium' },
]

export const acquisitionChannelsMock: AcquisitionMetric[] = [
  { label: 'Referrals', value: '34%' },
  { label: 'Social ads', value: '28%' },
  { label: 'Organic', value: '26%' },
  { label: 'Partners', value: '12%' },
]
