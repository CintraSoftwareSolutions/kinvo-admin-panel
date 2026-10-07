// Shapes match the live /admin/users* responses. `status` and `risk` are the
// panel's collapsed display labels; filter and act on the honest fields beside them.

export type UserStatus = 'Active' | 'Premium' | 'Inactive' | 'Flagged'
export type RiskLevel = 'Low risk' | 'Medium risk' | 'High risk'
export type AccountStatus = 'pending' | 'active' | 'suspended' | 'deleted'
export type Tier = 'free' | 'basic' | 'advanced'
export type StaffRole = 'user' | 'moderator' | 'admin'
export type TopUserManagementTab = 'user-table' | 'snapshot' | 'roles-rights' | 'operator-guide'
export type UserTableTab = 'all-users' | 'audit-log'
export type RolesRightsTab = 'permissions' | 'guardrails'

/** Row of GET /admin/users */
export type User = {
  id: string
  name: string
  email: string | null
  avatar: string | null
  joinDate: string
  lastActive: string | null
  status: UserStatus
  plan: string
  mode: string
  risk: RiskLevel
  account_status: AccountStatus
  tier: Tier
  is_flagged: boolean
  is_verified: boolean
  staff_role: StaffRole
  risk_score: number
  suspended_at: string | null
  suspension_reason: string | null
}

/** GET /admin/users/{id} — counts, not content. */
export type UserDetail = User & {
  date_of_birth: string | null
  onboarded_at: string | null
  is_snoozed: boolean
  modes: Array<{ mode: string; label: string; is_primary: boolean }>
  verification: Record<string, unknown> | null
  counts: {
    matches: number
    reports_received: number
    reports_filed: number
    blocks_received: number
    open_flags: number
  }
  risk_signals: {
    open_reports: number
    high_flags: number
    medium_flags: number
    low_flags: number
    blocks_received: number
  }
}

/** GET /admin/users/{id}/membership — subscription history, read-only. */
export type Membership = {
  id: string
  userId: string
  startDate: string
  subscriptionPlan: string
  renewalDate: string | null
  paymentMethod: string
  paymentStatus: string
  status: string
  is_active: boolean
}

/** GET /admin/users/{id}/activity — recorded events only. */
export type ActivityHistory = {
  id: string
  userId: string
  date: string
  recentAction: string
  trustEvent: string
  planEvent: string
  lastActive: string | null
  state: 'Healthy' | 'Watch' | 'Escalated'
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
  avatar?: string | null
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

/** GET /admin/users/snapshot */
export type SnapshotData = {
  metrics: SnapshotMetric[]
  statusCounts: Array<{ label: string; value: number }>
  topModes: Array<{ label: string; value: string }>
  paymentHealth: Array<{ label: string; value: number }>
  highValueMembers: NamedValue[]
  attentionQueue: AttentionItem[]
  recentAccountEvents: AccountEvent[]
}

/** Row of GET /admin/audit-log */
export type AuditEntry = {
  id: string
  action: string
  target_type: string
  target_id: string | null
  metadata: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
  admin: { id: string; display_name: string | null; primary_photo_url: string | null } | null
}

/** GET /admin/roles */
export type AdminRole = {
  id: string
  key: string
  title: string
  description: string | null
  is_system: boolean
  admins: number
  rights: number
}

/** GET /admin/roles/{id}/permissions */
export type Permission = {
  id: string
  key: string
  title: string
  description: string
  category: string
  allowed: boolean
}
