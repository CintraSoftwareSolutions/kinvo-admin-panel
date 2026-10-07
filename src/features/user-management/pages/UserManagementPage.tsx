import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { usePermissions } from '../../auth/hooks/usePermissions'
import { ErrorState } from '../../../shared/components/ErrorState'
import { PageShell } from '../../../shared/components/PageShell'
import { PillTabs } from '../../../shared/components/PillTabs'
import { SectionCard } from '../../../shared/components/SectionCard'
import { Skeleton } from '../../../shared/components/Skeleton'
import { Select } from '../../../shared/forms/Select'
import { appIcons } from '../../../shared/icons/appIcons'
import { exportCsv } from '../../../shared/utils/exportCsv'
import { formatDate } from '../../../shared/utils/formatDate'
import { useAdminRoles, useUserSnapshot } from '../api/userManagement.api'
import { useAuditLog, useUsers, type UserFilters } from '../hooks/useUsers'
import type { RolesRightsTab, TopUserManagementTab, User, UserTableTab } from '../types/userManagement.types'
import { OperatorGuidePanel } from '../components/OperatorGuide/OperatorGuidePanel'
import { GuardrailsPanel } from '../components/RolesRights/GuardrailsPanel'
import { PermissionsPanel } from '../components/RolesRights/PermissionsPanel'
import { RoleSelector } from '../components/RolesRights/RoleSelector'
import { AttentionQueue } from '../components/Snapshot/AttentionQueue'
import { HighValueMembers } from '../components/Snapshot/HighValueMembers'
import { RecentAccountEvents } from '../components/Snapshot/RecentAccountEvents'
import { UserWorkspaceSummary } from '../components/Snapshot/UserWorkspaceSummary'
import { AccountActionModal, ChangeRoleModal } from '../components/UserTable/AccountActionModals'
import { AllUsersTable } from '../components/UserTable/AllUsersTable'
import { AuditLogTable } from '../components/UserTable/AuditLogTable'
import { UserDetailsDrawer } from '../components/UserDetailsDrawer'
import { UserManagementTabs } from '../components/UserManagementTabs'

type UserManagementPageProps = {
  searchQuery: string
}

const rolesTabs = [
  { value: 'permissions', label: 'Permissions', icon: appIcons.userManagement.permissions },
  { value: 'guardrails', label: 'Guardrails', icon: appIcons.userManagement.guardrails },
] satisfies Array<{ value: RolesRightsTab; label: string; icon: typeof appIcons.userManagement.permissions }>

const ExportIcon = appIcons.actions.export

const emptyFilters: UserFilters = { status: '', tier: '', flagged: false }

export function UserManagementPage({ searchQuery }: UserManagementPageProps) {
  const [activeTab, setActiveTab] = useState<TopUserManagementTab>('user-table')
  const [activeTableTab, setActiveTableTab] = useState<UserTableTab>('all-users')
  const [activeRolesTab, setActiveRolesTab] = useState<RolesRightsTab>('permissions')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [accountActionUser, setAccountActionUser] = useState<User | null>(null)
  const [roleUser, setRoleUser] = useState<User | null>(null)

  return (
    <PageShell className="space-y-4">
      <UserManagementTabs activeTab={activeTab} onChange={setActiveTab} />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          {activeTab === 'user-table' ? (
            <UserTablePanel
              searchQuery={searchQuery}
              activeTableTab={activeTableTab}
              onTableTabChange={setActiveTableTab}
              onViewUser={setSelectedUser}
              onAccountAction={setAccountActionUser}
              onChangeRole={setRoleUser}
            />
          ) : null}
          {activeTab === 'snapshot' ? <SnapshotPanel /> : null}
          {activeTab === 'roles-rights' ? (
            <RolesRightsPanel activeRolesTab={activeRolesTab} onRolesTabChange={setActiveRolesTab} />
          ) : null}
          {activeTab === 'operator-guide' ? <OperatorGuidePanel /> : null}
        </motion.div>
      </AnimatePresence>
      <UserDetailsDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
      <AccountActionModal user={accountActionUser} onClose={() => setAccountActionUser(null)} />
      <ChangeRoleModal user={roleUser} onClose={() => setRoleUser(null)} />
    </PageShell>
  )
}

type UserTablePanelProps = {
  searchQuery: string
  activeTableTab: UserTableTab
  onTableTabChange: (tab: UserTableTab) => void
  onViewUser: (user: User) => void
  onAccountAction: (user: User) => void
  onChangeRole: (user: User) => void
}

function UserTablePanel({
  searchQuery,
  activeTableTab,
  onTableTabChange,
  onViewUser,
  onAccountAction,
  onChangeRole,
}: UserTablePanelProps) {
  const { can } = usePermissions()
  const [filters, setFilters] = useState<UserFilters>(emptyFilters)
  const users = useUsers(searchQuery, filters)
  const canAudit = can('audit.read')
  const audit = useAuditLog(canAudit && activeTableTab === 'audit-log')

  const tableTabs = [
    { value: 'all-users' as const, label: 'All users', icon: appIcons.userManagement.userTable },
    ...(canAudit ? [{ value: 'audit-log' as const, label: 'Audit log', icon: appIcons.userManagement.activityHistory }] : []),
  ]

  function handleExport() {
    exportCsv('kinvo-users-page.csv', [
      ['Name', 'Email', 'Plan', 'Tier', 'Account status', 'Verified', 'Flagged', 'Risk', 'Joined'],
      ...users.items.map((user) => [
        user.name,
        user.email ?? '',
        user.plan,
        user.tier,
        user.account_status,
        String(user.is_verified),
        String(user.is_flagged),
        user.risk,
        formatDate(user.joinDate),
      ]),
    ])
  }

  return (
    <SectionCard className="min-h-[calc(100vh-170px)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Directory</p>
      <h2 className="mt-3 text-base font-semibold text-slate-950">
        {activeTableTab === 'audit-log' ? 'Admin audit log' : 'All users list'}
      </h2>
      <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <PillTabs
          tabs={tableTabs}
          activeTab={activeTableTab}
          onChange={onTableTabChange}
          variant="underline"
          className="xl:flex-1"
        />
        {activeTableTab === 'all-users' ? (
          <div className="flex flex-wrap items-center gap-2">
            <Select
              aria-label="Account status"
              value={filters.status}
              onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value as UserFilters['status'] }))}
            >
              <option value="">Any status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </Select>
            <Select
              aria-label="Tier"
              value={filters.tier}
              onChange={(event) => setFilters((current) => ({ ...current, tier: event.target.value as UserFilters['tier'] }))}
            >
              <option value="">Any tier</option>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="advanced">Advanced</option>
            </Select>
            <label className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={filters.flagged}
                onChange={(event) => setFilters((current) => ({ ...current, flagged: event.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
              />
              Flagged only
            </label>
            <button
              type="button"
              onClick={handleExport}
              disabled={users.items.length === 0}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-violet-300 hover:text-violet-700 disabled:opacity-50"
            >
              <ExportIcon className="h-4 w-4" aria-hidden="true" />
              Export page
            </button>
          </div>
        ) : null}
      </div>
      <div className="mt-4">
        {activeTableTab === 'all-users' ? (
          <AllUsersTable
            users={users.items}
            loading={users.isLoading}
            error={users.error}
            onRetry={() => void users.refetch()}
            pagination={users.pagination}
            onViewUser={onViewUser}
            onAccountAction={onAccountAction}
            onChangeRole={onChangeRole}
          />
        ) : (
          <AuditLogTable
            entries={audit.items}
            loading={audit.isLoading}
            error={audit.error}
            onRetry={() => void audit.refetch()}
            pagination={audit.pagination}
          />
        )}
      </div>
    </SectionCard>
  )
}

function SnapshotPanel() {
  const snapshot = useUserSnapshot()

  if (snapshot.isPending) {
    return (
      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <Skeleton className="h-120 rounded-[28px]" />
        <Skeleton className="h-120 rounded-[28px]" />
      </div>
    )
  }

  if (snapshot.error) {
    return <ErrorState error={snapshot.error} onRetry={() => void snapshot.refetch()} />
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
      <SectionCard className="min-h-[calc(100vh-170px)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Snapshot</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">User workspace summary</h2>
        <p className="mt-1 text-xs text-slate-400">Counted live on each load.</p>
        <div className="mt-6">
          <UserWorkspaceSummary snapshot={snapshot.data} />
        </div>
      </SectionCard>
      <SectionCard className="grid content-start gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Focus</p>
          <h2 className="mt-3 text-base font-semibold text-slate-950">High-value members</h2>
        </div>
        <HighValueMembers members={snapshot.data.highValueMembers} />
        <AttentionQueue items={snapshot.data.attentionQueue} />
        <RecentAccountEvents events={snapshot.data.recentAccountEvents} />
      </SectionCard>
    </div>
  )
}

type RolesRightsPanelProps = {
  activeRolesTab: RolesRightsTab
  onRolesTabChange: (tab: RolesRightsTab) => void
}

function RolesRightsPanel({ activeRolesTab, onRolesTabChange }: RolesRightsPanelProps) {
  const { can } = usePermissions()
  const roles = useAdminRoles()
  const [chosenRoleId, setChosenRoleId] = useState<string | null>(null)
  const selectedRole = roles.data?.find((role) => role.id === chosenRoleId) ?? roles.data?.[0] ?? null

  return (
    <SectionCard className="min-h-[calc(100vh-170px)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Rights</p>
      <h2 className="mt-3 text-base font-semibold text-slate-950">Admin roles & access</h2>
      <PillTabs tabs={rolesTabs} activeTab={activeRolesTab} onChange={onRolesTabChange} className="mt-6" />
      <div className="mt-4 grid gap-4">
        {activeRolesTab === 'guardrails' ? (
          <GuardrailsPanel />
        ) : !can('roles.read') ? (
          <ErrorState error={new Error('Viewing roles requires roles.read.')} />
        ) : roles.isPending ? (
          <Skeleton className="h-24" />
        ) : roles.error ? (
          <ErrorState error={roles.error} onRetry={() => void roles.refetch()} />
        ) : (
          <>
            <RoleSelector roles={roles.data} selectedRoleId={selectedRole?.id ?? null} onRoleChange={setChosenRoleId} />
            {selectedRole ? <PermissionsPanel key={selectedRole.id} role={selectedRole} /> : null}
          </>
        )}
      </div>
    </SectionCard>
  )
}
