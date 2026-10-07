import type { ChurnPoint, RenewalConfidenceRow } from '../types/analyticsDashboard.types'

export const churnByBillingMock: ChurnPoint[] = [
  { month: 'Jan', primary: 8, secondary: 4 },
  { month: 'Feb', primary: 7, secondary: 4 },
  { month: 'Mar', primary: 9, secondary: 3 },
  { month: 'Apr', primary: 6, secondary: 3 },
  { month: 'May', primary: 7, secondary: 2 },
  { month: 'Jun', primary: 5, secondary: 2 },
  { month: 'Jul', primary: 4, secondary: 2 },
]

export const renewalConfidenceMock: RenewalConfidenceRow[] = [
  { plan: 'Premium Monthly', renewed: '2,171', churn: '6.4%' },
  { plan: 'Premium Quarterly', renewed: '917', churn: '5.1%' },
  { plan: 'Premium Yearly', renewed: '598', churn: '3.2%' },
  { plan: 'Student Plus', renewed: '332', churn: '8.4%' },
]
