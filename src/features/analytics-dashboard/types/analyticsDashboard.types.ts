export type AnalyticsTab = 'engagement' | 'monetization' | 'retention' | 'modes'

/** Every series carries `basis`: what the numbers actually count. Render it beside the chart. */
export type Series<TPoint> = {
  basis: string
  points: TPoint[]
}

/** activeUsers is the account base at month end — NOT monthly active users. */
export type EngagementPoint = {
  month: string
  activeUsers: number
  verifiedUsers: number
}

export type WeeklyResolutionPoint = {
  week: string
  reported: number
  resolved: number
}

/** churn_percent is lifetime, not monthly. */
export type SubscriptionMixRow = {
  plan: string
  active: number
  renewed: number
  churn_percent: number
  mrr_minor: number
  currency: string
}

/** Money entries carry the authoritative amount_minor + currency; value is display only. */
export type RevenueMetric = {
  label: string
  value: string
  amount_minor: number | null
  currency: string | null
  percent: number | null
}

/** Monthly plans (primary) against yearly (secondary), by month of request. */
export type ChurnPoint = {
  month: string
  primary: number
  secondary: number
}

export type ModePerformanceRow = {
  mode: string
  activeUsers: number
  completion_percent: number
  trustScore: 'High' | 'Medium' | 'Low'
}

/** Sign-in method of each account's first identity. NOT marketing attribution. */
export type SignInMethodMetric = {
  label: string
  value: string
  percent: number
  users: number
}

/** GET /admin/analytics — all four tabs in one uncached response. */
export type AnalyticsDashboard = {
  generated_at: string
  engagement: Series<EngagementPoint>
  weeklyResolution: Series<WeeklyResolutionPoint>
  subscriptionMix: Series<SubscriptionMixRow>
  revenuePulse: Series<RevenueMetric>
  churnByBilling: Series<ChurnPoint>
  modePerformance: Series<ModePerformanceRow>
  acquisitionChannels: Series<SignInMethodMetric>
}
