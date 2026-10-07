import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PageShell } from '../../../shared/components/PageShell'
import { PillTabs } from '../../../shared/components/PillTabs'
import { RiskBadge } from '../../../shared/components/RiskBadge'
import { SectionCard } from '../../../shared/components/SectionCard'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { appIcons } from '../../../shared/icons/appIcons'
import { exportCsv } from '../../../shared/utils/exportCsv'
import { usersMock } from '../data/users.mock'
import { useDisclosure } from '../../../shared/hooks/useDisclosure'
import { useUserActivity, type ActivityRow } from '../hooks/useUserActivity'
import { useUserMemberships, type MembershipRow } from '../hooks/useUserMemberships'
import { useUsers } from '../hooks/useUsers'
import type {
  RolesRightsTab,
  TopUserManagementTab,
  User,
  UserTableTab,
} from '../types/userManagement.types'
import { AddUserModal } from '../components/AddUserModal'
import { OperatorGuidePanel } from '../components/OperatorGuide/OperatorGuidePanel'
import { GuardrailsPanel } from '../components/RolesRights/GuardrailsPanel'
import { PermissionsPanel } from '../components/RolesRights/PermissionsPanel'
import { RoleSelector } from '../components/RolesRights/RoleSelector'
import { AttentionQueue } from '../components/Snapshot/AttentionQueue'
import { HighValueMembers } from '../components/Snapshot/HighValueMembers'
import { RecentAccountEvents } from '../components/Snapshot/RecentAccountEvents'
import { UserWorkspaceSummary } from '../components/Snapshot/UserWorkspaceSummary'
import { ActivityHistoryTable } from '../components/UserTable/ActivityHistoryTable'
import type { ActivityMoreAction } from '../components/UserTable/ActivityHistoryTable'
import { AllUsersTable } from '../components/UserTable/AllUsersTable'
import type { UserMoreAction } from '../components/UserTable/AllUsersTable'
import { MembershipTable } from '../components/UserTable/MembershipTable'
import type { MembershipMoreAction } from '../components/UserTable/MembershipTable'
import { UserQuickActionModal } from '../components/UserTable/UserQuickActionModal'
import type { QuickActionDetail, QuickActionOption } from '../components/UserTable/UserQuickActionModal'
import { UserDetailsDrawer } from '../components/UserDetailsDrawer'
import { UserManagementTabs } from '../components/UserManagementTabs'
import { defaultRoleId, type RoleId } from '../data/roles.mock'

type UserManagementPageProps = {
  searchQuery: string
}

const tableTabs = [
  { value: 'all-users', label: 'All users', icon: appIcons.userManagement.userTable },
  { value: 'membership', label: 'Membership', icon: appIcons.userManagement.membership },
  { value: 'activity-history', label: 'Activity history', icon: appIcons.userManagement.activityHistory },
] satisfies Array<{ value: UserTableTab; label: string; icon: typeof appIcons.userManagement.userTable }>

const rolesTabs = [
  { value: 'permissions', label: 'Permissions', icon: appIcons.userManagement.permissions },
  { value: 'guardrails', label: 'Guardrails', icon: appIcons.userManagement.guardrails },
] satisfies Array<{ value: RolesRightsTab; label: string; icon: typeof appIcons.userManagement.permissions }>

const ExportIcon = appIcons.actions.export
const AddUserIcon = appIcons.actions.addUser

type AccountAction = 'restrict-account' | 'block-user' | 'mark-risky'
type BillingAction = 'change-plan' | 'mark-paid' | 'mark-pending' | 'mark-failed' | 'cancel-subscription'
type TrustReviewAction = 'mark-healthy' | 'mark-watch' | 'escalate' | 'add-review-note'

type UserOverride = Partial<Pick<User, 'risk' | 'status'>>
type MembershipOverride = Partial<Pick<MembershipRow, 'paymentStatus' | 'subscriptionPlan'>>
type ActivityOverride = Partial<Pick<ActivityRow, 'state' | 'trustEvent'>>
type MessageModal = {
  title: string
  description: string
  details?: QuickActionDetail[]
}

const accountActionOptions: Array<QuickActionOption<AccountAction>> = [
  {
    value: 'restrict-account',
    label: 'Restrict account',
    description: 'Move the account into a restricted review state.',
  },
  { value: 'block-user', label: 'Block user', description: 'Disable user activity in this admin session.' },
  { value: 'mark-risky', label: 'Mark as risky', description: 'Raise the account risk signal for review.' },
]

const billingActionOptions: Array<QuickActionOption<BillingAction>> = [
  { value: 'change-plan', label: 'Change plan', description: 'Move the member to Premium Monthly.' },
  { value: 'mark-paid', label: 'Mark as paid', description: 'Set the payment status to Paid.' },
  { value: 'mark-pending', label: 'Mark as pending', description: 'Set the payment status to Pending.' },
  { value: 'mark-failed', label: 'Mark as failed', description: 'Set the payment status to Failed.' },
  { value: 'cancel-subscription', label: 'Cancel subscription', description: 'Mark this subscription as canceled.' },
]

const trustReviewOptions: Array<QuickActionOption<TrustReviewAction>> = [
  { value: 'mark-healthy', label: 'Mark healthy', description: 'Clear the review state for this activity.' },
  { value: 'mark-watch', label: 'Mark watch', description: 'Keep this user in a watch state.' },
  { value: 'escalate', label: 'Escalate', description: 'Escalate this event to trust specialists.' },
  { value: 'add-review-note', label: 'Add review note', description: 'Attach a local internal review note.' },
]

export function UserManagementPage({ searchQuery }: UserManagementPageProps) {
  const [activeTab, setActiveTab] = useState<TopUserManagementTab>('user-table')
  const [activeTableTab, setActiveTableTab] = useState<UserTableTab>('all-users')
  const [activeRolesTab, setActiveRolesTab] = useState<RolesRightsTab>('permissions')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userOverrides, setUserOverrides] = useState<Record<string, UserOverride>>({})
  const [membershipOverrides, setMembershipOverrides] = useState<Record<string, MembershipOverride>>({})
  const [activityOverrides, setActivityOverrides] = useState<Record<string, ActivityOverride>>({})
  const [accountActionUser, setAccountActionUser] = useState<User | null>(null)
  const [accountAction, setAccountAction] = useState<AccountAction>('restrict-account')
  const [membershipDetails, setMembershipDetails] = useState<MembershipRow | null>(null)
  const [billingActionMembership, setBillingActionMembership] = useState<MembershipRow | null>(null)
  const [billingAction, setBillingAction] = useState<BillingAction>('change-plan')
  const [activityDetails, setActivityDetails] = useState<ActivityRow | null>(null)
  const [trustReviewActivity, setTrustReviewActivity] = useState<ActivityRow | null>(null)
  const [trustReviewAction, setTrustReviewAction] = useState<TrustReviewAction>('mark-healthy')
  const [messageModal, setMessageModal] = useState<MessageModal | null>(null)
  const addUserModal = useDisclosure()
  const baseUsers = useUsers(searchQuery)
  const baseMemberships = useUserMemberships(searchQuery)
  const baseActivities = useUserActivity(searchQuery)
  const users = useMemo(
    () => baseUsers.map((user) => ({ ...user, ...userOverrides[user.id] })),
    [baseUsers, userOverrides],
  )
  const memberships = useMemo(
    () => baseMemberships.map((membership) => ({ ...membership, ...membershipOverrides[membership.id] })),
    [baseMemberships, membershipOverrides],
  )
  const activities = useMemo(
    () => baseActivities.map((activity) => ({ ...activity, ...activityOverrides[activity.id] })),
    [activityOverrides, baseActivities],
  )

  function handleOpenAccountAction(user: User) {
    setAccountAction('restrict-account')
    setAccountActionUser(user)
  }

  function handleSaveAccountAction() {
    if (!accountActionUser) {
      return
    }

    const nextState = getAccountActionState(accountAction)
    setUserOverrides((currentOverrides) => ({
      ...currentOverrides,
      [accountActionUser.id]: {
        ...currentOverrides[accountActionUser.id],
        ...nextState,
      },
    }))
    setAccountActionUser(null)
  }

  function handleOpenBillingAction(membership: MembershipRow) {
    setBillingAction('change-plan')
    setBillingActionMembership(membership)
  }

  function handleSaveBillingAction() {
    if (!billingActionMembership) {
      return
    }

    const nextState = getBillingActionState(billingAction)
    setMembershipOverrides((currentOverrides) => ({
      ...currentOverrides,
      [billingActionMembership.id]: {
        ...currentOverrides[billingActionMembership.id],
        ...nextState,
      },
    }))
    setBillingActionMembership(null)
  }

  function handleOpenTrustReview(activity: ActivityRow) {
    setTrustReviewAction('mark-healthy')
    setTrustReviewActivity(activity)
  }

  function handleSaveTrustReview() {
    if (!trustReviewActivity) {
      return
    }

    const nextState = getTrustReviewState(trustReviewAction)
    setActivityOverrides((currentOverrides) => ({
      ...currentOverrides,
      [trustReviewActivity.id]: {
        ...currentOverrides[trustReviewActivity.id],
        ...nextState,
      },
    }))
    setTrustReviewActivity(null)
  }

  function handleUserMoreAction(user: User, action: UserMoreAction) {
    setMessageModal(getUserMoreActionMessage(user, action))
  }

  function handleMembershipMoreAction(membership: MembershipRow, action: MembershipMoreAction) {
    setMessageModal(getMembershipMoreActionMessage(membership, action))
  }

  function handleActivityMoreAction(activity: ActivityRow, action: ActivityMoreAction) {
    setMessageModal(getActivityMoreActionMessage(activity, action))
  }

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
              activeTableTab={activeTableTab}
              onTableTabChange={setActiveTableTab}
              users={users}
              memberships={memberships}
              activities={activities}
              onAddUser={addUserModal.onOpen}
              onExport={handleExport}
              onViewUser={setSelectedUser}
              onAccountAction={handleOpenAccountAction}
              onUserMoreAction={handleUserMoreAction}
              onViewMembership={setMembershipDetails}
              onBillingAction={handleOpenBillingAction}
              onMembershipMoreAction={handleMembershipMoreAction}
              onViewActivity={setActivityDetails}
              onTrustReview={handleOpenTrustReview}
              onActivityMoreAction={handleActivityMoreAction}
            />
          ) : null}
          {activeTab === 'snapshot' ? <SnapshotPanel /> : null}
          {activeTab === 'roles-rights' ? (
            <RolesRightsPanel activeRolesTab={activeRolesTab} onRolesTabChange={setActiveRolesTab} />
          ) : null}
          {activeTab === 'operator-guide' ? <OperatorGuidePanel /> : null}
        </motion.div>
      </AnimatePresence>
      <AddUserModal open={addUserModal.open} onClose={addUserModal.onClose} />
      <UserDetailsDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
      <UserQuickActionModal
        open={Boolean(accountActionUser)}
        title="Account action"
        description="Choose a local account action for this user."
        details={accountActionUser ? getUserDetails(accountActionUser) : undefined}
        options={accountActionOptions}
        value={accountAction}
        onValueChange={setAccountAction}
        onSave={handleSaveAccountAction}
        onClose={() => setAccountActionUser(null)}
      />
      <UserQuickActionModal
        open={Boolean(membershipDetails)}
        title="Membership details"
        details={membershipDetails ? getMembershipDetails(membershipDetails) : undefined}
        onClose={() => setMembershipDetails(null)}
      />
      <UserQuickActionModal
        open={Boolean(billingActionMembership)}
        title="Billing action"
        description="Choose a local billing action for this membership."
        details={billingActionMembership ? getMembershipDetails(billingActionMembership) : undefined}
        options={billingActionOptions}
        value={billingAction}
        onValueChange={setBillingAction}
        onSave={handleSaveBillingAction}
        onClose={() => setBillingActionMembership(null)}
      />
      <UserQuickActionModal
        open={Boolean(activityDetails)}
        title="Activity details"
        details={activityDetails ? getActivityDetails(activityDetails) : undefined}
        onClose={() => setActivityDetails(null)}
      />
      <UserQuickActionModal
        open={Boolean(trustReviewActivity)}
        title="Trust review"
        description="Choose a local trust review action for this event."
        details={trustReviewActivity ? getActivityDetails(trustReviewActivity) : undefined}
        options={trustReviewOptions}
        value={trustReviewAction}
        onValueChange={setTrustReviewAction}
        onSave={handleSaveTrustReview}
        onClose={() => setTrustReviewActivity(null)}
      />
      <UserQuickActionModal
        open={Boolean(messageModal)}
        title={messageModal?.title ?? 'Quick action'}
        description={messageModal?.description}
        details={messageModal?.details}
        onClose={() => setMessageModal(null)}
      />
    </PageShell>
  )
}

function handleExport() {
  exportCsv('kinvo-users.csv', [
    ['Name', 'Email', 'Plan', 'Status', 'Risk'],
    ...usersMock.map((user) => [user.name, user.email, user.plan, user.status, user.risk]),
  ])
}

function getAccountActionState(action: AccountAction): UserOverride {
  const states: Record<AccountAction, UserOverride> = {
    'restrict-account': { status: 'Flagged', risk: 'Medium risk' },
    'block-user': { status: 'Inactive', risk: 'High risk' },
    'mark-risky': { risk: 'High risk' },
  }

  return states[action]
}

function getBillingActionState(action: BillingAction): MembershipOverride {
  const states: Record<BillingAction, MembershipOverride> = {
    'change-plan': { subscriptionPlan: 'Premium Monthly' },
    'mark-paid': { paymentStatus: 'Paid' },
    'mark-pending': { paymentStatus: 'Pending' },
    'mark-failed': { paymentStatus: 'Failed' },
    'cancel-subscription': { subscriptionPlan: 'Canceled', paymentStatus: 'Failed' },
  }

  return states[action]
}

function getTrustReviewState(action: TrustReviewAction): ActivityOverride {
  const states: Record<TrustReviewAction, ActivityOverride> = {
    'mark-healthy': { state: 'Healthy', trustEvent: 'Trust review cleared' },
    'mark-watch': { state: 'Watch', trustEvent: 'Added to trust watch' },
    escalate: { state: 'Escalated', trustEvent: 'Escalated to trust specialists' },
    'add-review-note': { trustEvent: 'Internal review note added' },
  }

  return states[action]
}

function getUserDetails(user: User): QuickActionDetail[] {
  return [
    { label: 'User', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Plan', value: user.plan },
    { label: 'Status', value: <StatusBadge status={user.status} /> },
    { label: 'Risk', value: <RiskBadge risk={user.risk} /> },
  ]
}

function getMembershipDetails(membership: MembershipRow): QuickActionDetail[] {
  return [
    { label: 'User', value: membership.user.name },
    { label: 'Plan', value: membership.subscriptionPlan },
    { label: 'Renewal', value: membership.renewalDate },
    { label: 'Payment', value: <StatusBadge status={membership.paymentStatus} /> },
  ]
}

function getActivityDetails(activity: ActivityRow): QuickActionDetail[] {
  return [
    { label: 'User', value: activity.user.name },
    { label: 'Date', value: activity.date },
    { label: 'Action', value: activity.recentAction },
    { label: 'Trust event', value: activity.trustEvent },
    { label: 'State', value: <StatusBadge status={activity.state} /> },
  ]
}

function getUserMoreActionMessage(user: User, action: UserMoreAction): MessageModal {
  const messages: Record<UserMoreAction, string> = {
    'edit-user': 'Edit user opens a mock-only local workflow for this admin panel.',
    'send-notification': 'Notification is queued locally for this mock admin session.',
    'export-user-data': 'User data export is prepared from local mock data.',
    'remove-user': 'Removal is simulated only and does not delete mock data.',
  }

  return {
    title: 'User action',
    description: messages[action],
    details: getUserDetails(user),
  }
}

function getMembershipMoreActionMessage(membership: MembershipRow, action: MembershipMoreAction): MessageModal {
  const messages: Record<MembershipMoreAction, string> = {
    'view-invoice': 'Invoice details are shown from local mock billing records.',
    'apply-promo': 'Promo application is simulated for this mock session.',
    'send-payment-reminder': 'Payment reminder is queued locally.',
    'export-billing-record': 'Billing export is prepared from mock data.',
  }

  return {
    title: 'Membership action',
    description: messages[action],
    details: getMembershipDetails(membership),
  }
}

function getActivityMoreActionMessage(activity: ActivityRow, action: ActivityMoreAction): MessageModal {
  const messages: Record<ActivityMoreAction, string> = {
    'open-audit-trail': 'Audit trail details are shown from local mock activity.',
    'export-event': 'Activity event export is prepared from mock data.',
    'add-internal-note': 'Internal note is simulated locally.',
    'notify-operator': 'Operator notification is queued locally.',
  }

  return {
    title: 'Activity action',
    description: messages[action],
    details: getActivityDetails(activity),
  }
}

type UserTablePanelProps = {
  activeTableTab: UserTableTab
  onTableTabChange: (tab: UserTableTab) => void
  users: ReturnType<typeof useUsers>
  memberships: ReturnType<typeof useUserMemberships>
  activities: ReturnType<typeof useUserActivity>
  onAddUser: () => void
  onExport: () => void
  onViewUser: (user: User) => void
  onAccountAction: (user: User) => void
  onUserMoreAction: (user: User, action: UserMoreAction) => void
  onViewMembership: (membership: MembershipRow) => void
  onBillingAction: (membership: MembershipRow) => void
  onMembershipMoreAction: (membership: MembershipRow, action: MembershipMoreAction) => void
  onViewActivity: (activity: ActivityRow) => void
  onTrustReview: (activity: ActivityRow) => void
  onActivityMoreAction: (activity: ActivityRow, action: ActivityMoreAction) => void
}

function UserTablePanel({
  activeTableTab,
  onTableTabChange,
  users,
  memberships,
  activities,
  onAddUser,
  onExport,
  onViewUser,
  onAccountAction,
  onUserMoreAction,
  onViewMembership,
  onBillingAction,
  onMembershipMoreAction,
  onViewActivity,
  onTrustReview,
  onActivityMoreAction,
}: UserTablePanelProps) {
  return (
    <SectionCard className="min-h-[calc(100vh-170px)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Directory</p>
      <h2 className="mt-3 text-base font-semibold text-slate-950">All users list</h2>
      <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <PillTabs
          tabs={tableTabs}
          activeTab={activeTableTab}
          onChange={onTableTabChange}
          variant="underline"
          className="xl:flex-1"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-violet-300 hover:text-violet-700"
          >
            <ExportIcon className="h-4 w-4" aria-hidden="true" />
            Export
          </button>
          <button
            type="button"
            onClick={onAddUser}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(111,61,204,0.26)] transition hover:bg-violet-700"
          >
            <AddUserIcon className="h-4 w-4" aria-hidden="true" />
            Add new user
          </button>
        </div>
      </div>
      <div className="mt-4">
        {activeTableTab === 'all-users' ? (
          <AllUsersTable
            users={users}
            onViewUser={onViewUser}
            onAccountAction={onAccountAction}
            onMoreAction={onUserMoreAction}
          />
        ) : null}
        {activeTableTab === 'membership' ? (
          <MembershipTable
            memberships={memberships}
            onViewMembership={onViewMembership}
            onBillingAction={onBillingAction}
            onMoreAction={onMembershipMoreAction}
          />
        ) : null}
        {activeTableTab === 'activity-history' ? (
          <ActivityHistoryTable
            activities={activities}
            onViewActivity={onViewActivity}
            onTrustReview={onTrustReview}
            onMoreAction={onActivityMoreAction}
          />
        ) : null}
      </div>
    </SectionCard>
  )
}

function SnapshotPanel() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
      <SectionCard className="min-h-[calc(100vh-170px)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Snapshot</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">User workspace summary</h2>
        <div className="mt-6">
          <UserWorkspaceSummary />
        </div>
      </SectionCard>
      <SectionCard className="grid content-start gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Focus</p>
          <h2 className="mt-3 text-base font-semibold text-slate-950">High-value members</h2>
        </div>
        <HighValueMembers />
        <AttentionQueue />
        <RecentAccountEvents />
      </SectionCard>
    </div>
  )
}

type RolesRightsPanelProps = {
  activeRolesTab: RolesRightsTab
  onRolesTabChange: (tab: RolesRightsTab) => void
}

function RolesRightsPanel({ activeRolesTab, onRolesTabChange }: RolesRightsPanelProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId>(defaultRoleId)

  return (
    <SectionCard className="min-h-[calc(100vh-170px)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Rights</p>
      <h2 className="mt-3 text-base font-semibold text-slate-950">Admin roles & access</h2>
      <PillTabs tabs={rolesTabs} activeTab={activeRolesTab} onChange={onRolesTabChange} className="mt-6" />
      <div className="mt-4 grid gap-4">
        <RoleSelector selectedRoleId={selectedRoleId} onRoleChange={setSelectedRoleId} />
        {activeRolesTab === 'permissions' ? <PermissionsPanel selectedRoleId={selectedRoleId} /> : <GuardrailsPanel />}
      </div>
    </SectionCard>
  )
}
