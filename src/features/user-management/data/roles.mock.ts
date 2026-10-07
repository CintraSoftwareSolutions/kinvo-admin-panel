import type { AdminRole, Guardrail, Permission } from '../types/userManagement.types'

export const defaultRoleId = 'trust-specialist'

type PermissionCatalogItem = Omit<Permission, 'allowed'>

export const permissionsCatalog = [
  {
    id: 'view-profiles',
    title: 'View profiles',
    description: 'Open profiles, preferences, photos, and connection context.',
  },
  {
    id: 'approve-verification',
    title: 'Approve verification',
    description: 'Review identity submissions and fast-lane clean approvals.',
  },
  {
    id: 'export-data',
    title: 'Export data',
    description: 'Download CSV snapshots and audit-ready queue exports.',
  },
  {
    id: 'manage-credits',
    title: 'Manage credits',
    description: 'Issue goodwill credits, promo balances, and recovery offers.',
  },
  {
    id: 'view-audit-trail',
    title: 'View audit trail',
    description: 'Inspect permission changes, exports, and sensitive account actions.',
  },
  {
    id: 'moderate-reports',
    title: 'Moderate reports',
    description: 'Dismiss, restrict, and escalate trust & safety cases.',
  },
  {
    id: 'edit-pricing',
    title: 'Edit pricing',
    description: 'Change plan copy, pricing, promos, and rollout notes.',
  },
  {
    id: 'assign-operators',
    title: 'Assign operators',
    description: 'Manage shift ownership, coverage, and queue routing.',
  },
  {
    id: 'launch-campaigns',
    title: 'Launch campaigns',
    description: 'Publish lifecycle offers, date prompts, and regional experiments.',
  },
] as const satisfies readonly PermissionCatalogItem[]

type PermissionId = (typeof permissionsCatalog)[number]['id']

export const rolePermissionsMock = {
  'support-lead': ['view-profiles', 'approve-verification', 'view-audit-trail', 'assign-operators'],
  'revenue-ops': [
    'view-profiles',
    'export-data',
    'manage-credits',
    'edit-pricing',
    'launch-campaigns',
    'view-audit-trail',
  ],
  'trust-specialist': ['view-profiles', 'approve-verification', 'export-data', 'moderate-reports', 'view-audit-trail'],
  'super-admin': [
    'view-profiles',
    'approve-verification',
    'export-data',
    'manage-credits',
    'view-audit-trail',
    'moderate-reports',
    'edit-pricing',
    'assign-operators',
    'launch-campaigns',
  ],
} as const satisfies Record<string, readonly PermissionId[]>

export type RoleId = keyof typeof rolePermissionsMock

export const rolesMock: Array<AdminRole & { id: RoleId }> = [
  { id: 'support-lead', title: 'Support lead', admins: 6, rights: rolePermissionsMock['support-lead'].length },
  { id: 'revenue-ops', title: 'Revenue ops', admins: 4, rights: rolePermissionsMock['revenue-ops'].length },
  { id: 'trust-specialist', title: 'Trust specialist', admins: 9, rights: rolePermissionsMock['trust-specialist'].length },
  { id: 'super-admin', title: 'Super admin', admins: 2, rights: rolePermissionsMock['super-admin'].length },
]

export function getRoleById(roleId: RoleId) {
  return rolesMock.find((role) => role.id === roleId) ?? rolesMock[0]
}

export function getPermissionsForRole(roleId: RoleId): Permission[] {
  const allowedPermissionIds = new Set<string>(rolePermissionsMock[roleId])

  return permissionsCatalog.map((permission) => ({
    ...permission,
    allowed: allowedPermissionIds.has(permission.id),
  }))
}

export const guardrailsMock: Guardrail[] = [
  { id: 'dual-approval', title: 'Dual approval for pricing changes', enabled: true },
  { id: 'linked-ticket', title: 'Linked ticket required', enabled: true },
  { id: 'session-audit', title: 'Sensitive-session audit', enabled: false },
]
