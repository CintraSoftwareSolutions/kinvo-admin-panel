export type PlanStatus = 'Live' | 'Promo' | 'Draft' | 'Grandfathered'

export type SubscriptionPlan = {
  id: string
  name: string
  billingCycle: string
  price: string
  note: string
  status: PlanStatus
  rolloutNote: string
}
