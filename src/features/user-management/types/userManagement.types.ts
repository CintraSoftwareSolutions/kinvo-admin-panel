export type UserStatus = 'Active' | 'Premium' | 'Inactive' | 'Flagged'
export type RiskLevel = 'Low risk' | 'Medium risk' | 'High risk'
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed'
export type PaymentMethod = 'Stripe' | 'Card' | 'Apple Pay'
export type ActivityState = 'Healthy' | 'Watch' | 'Escalated'
export type TopUserManagementTab = 'user-table' | 'snapshot' | 'roles-rights' | 'operator-guide'
export type UserTableTab = 'all-users' | 'membership' | 'activity-history'
export type RolesRightsTab = 'permissions' | 'guardrails'

export type User = {
  id: string
  name: string
  email: string
  joinDate: string
  plan: string
  lastActive: string
  mode: string
  status: UserStatus
  risk: RiskLevel
  avatar?: string
}

export type Membership = {
  id: string
  userId: string
  startDate: string
  subscriptionPlan: string
  renewalDate: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
}

export type ActivityHistory = {
  id: string
  userId: string
  date: string
  recentAction: string
  trustEvent: string
  planEvent: string
  lastActive: string
  state: ActivityState
}

export type SnapshotMetric = {
  label: string
  value: number
  tone: 'purple' | 'emerald' | 'rose' | 'blue'
}

export type NamedValue = {
  name: string
  detail: string
  value?: number
  avatar?: string
}

export type AttentionItem = {
  name: string
  detail: string
  risk: 'Medium' | 'High'
}

export type AccountEvent = {
  name: string
  event: string
}

export type SnapshotData = {
  metrics: SnapshotMetric[]
  statusCounts: Array<{ label: string; value: number }>
  topModes: Array<{ label: string; value: string }>
  paymentHealth: Array<{ label: PaymentStatus; value: number }>
  highValueMembers: NamedValue[]
  attentionQueue: AttentionItem[]
  recentAccountEvents: AccountEvent[]
}

export type AdminRole = {
  id: string
  title: string
  admins: number
  rights: number
  selected?: boolean
}

export type Permission = {
  id: string
  title: string
  description: string
  allowed: boolean
}

export type Guardrail = {
  id: string
  title: string
  enabled: boolean
}
