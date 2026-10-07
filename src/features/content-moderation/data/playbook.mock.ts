import type { QueueHealthMetric } from '../types/contentModeration.types'

export const queueHealthMock: QueueHealthMetric[] = [
  { label: 'Median first response', value: '11m' },
  { label: 'Pending escalations', value: '3' },
  {
    label: 'Queue policy',
    value: 'Fraud and payment-link reports move straight to restricted state before manual review.',
  },
]

export const escalationChecklistMock = [
  'High severity financial scam reports go to restricted state immediately.',
  'Repeat boundary concerns require a human note before the account is re-enabled.',
  'Low severity identity mismatches should be paired with verification review.',
]
