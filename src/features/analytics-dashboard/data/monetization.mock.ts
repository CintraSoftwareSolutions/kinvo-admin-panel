import type { RevenueMetric, SubscriptionMixRow } from '../types/analyticsDashboard.types'

export const subscriptionMixMock: SubscriptionMixRow[] = [
  { plan: 'Premium Monthly', active: '2,804', renewed: '2,171', churn: '6.4%' },
  { plan: 'Premium Quarterly', active: '1,122', renewed: '917', churn: '5.1%' },
  { plan: 'Premium Yearly', active: '684', renewed: '598', churn: '3.2%' },
  { plan: 'Student Plus', active: '426', renewed: '332', churn: '8.4%' },
]

export const revenuePulseMock: RevenueMetric[] = [
  { label: 'MRR', value: '$182k' },
  { label: 'Renewal rate', value: '84%' },
  { label: 'Failed charges', value: '2.6%' },
  { label: 'Upsell conversion', value: '11%' },
]
