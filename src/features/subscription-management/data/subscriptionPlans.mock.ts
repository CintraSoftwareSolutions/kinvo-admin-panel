import type { SubscriptionPlan } from '../types/subscriptionManagement.types'

export const subscriptionPlansMock: SubscriptionPlan[] = [
  {
    id: 'basic-monthly',
    name: 'Basic Premium',
    billingCycle: 'Monthly',
    price: '19',
    note: 'Always on',
    status: 'Live',
    rolloutNote: 'Baseline self-serve plan for all regions.',
  },
  {
    id: 'advanced-quarterly',
    name: 'Advanced Premium',
    billingCycle: 'Quarterly',
    price: '45',
    note: 'Winback 10%',
    status: 'Promo',
    rolloutNote: 'Quarterly retention offer for winback cohorts.',
  },
  {
    id: 'advanced-yearly',
    name: 'Advanced Premium',
    billingCycle: 'Yearly',
    price: '99',
    note: 'Legacy pricing',
    status: 'Grandfathered',
    rolloutNote: 'Legacy annual price for existing members.',
  },
  {
    id: 'student-plus-monthly',
    name: 'Student Plus',
    billingCycle: 'Monthly',
    price: '9',
    note: 'Campus promo',
    status: 'Draft',
    rolloutNote: 'Campus launch draft awaiting final approval.',
  },
]
