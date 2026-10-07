export type AnalyticsTab = 'engagement' | 'monetization' | 'retention' | 'channels'

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

export type SubscriptionMixRow = {
  plan: string
  active: string
  renewed: string
  churn: string
}

export type RevenueMetric = {
  label: string
  value: string
}

export type ChurnPoint = {
  month: string
  primary: number
  secondary: number
}

export type RenewalConfidenceRow = {
  plan: string
  renewed: string
  churn: string
}

export type ModePerformanceRow = {
  mode: string
  activeUsers: string
  completion: string
  trustScore: 'High' | 'Medium'
}

export type AcquisitionMetric = {
  label: string
  value: string
}
