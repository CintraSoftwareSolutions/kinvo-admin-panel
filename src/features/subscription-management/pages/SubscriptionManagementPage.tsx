import { AdminOperationsShell } from '../../../shared/components/AdminOperationsShell'
import { appIcons } from '../../../shared/icons/appIcons'
import { MembershipEditor } from '../components/MembershipEditor'
import { useSubscriptionPlans } from '../hooks/useSubscriptionPlans'

type SubscriptionManagementPageProps = {
  searchQuery: string
}

const membershipEditorPill = {
  value: 'membership-editor',
  label: 'Membership editor',
  icon: appIcons.adminOperations.membershipEditor,
}

export function SubscriptionManagementPage({ searchQuery }: SubscriptionManagementPageProps) {
  const { plans, updatePlan } = useSubscriptionPlans(searchQuery)

  return (
    <AdminOperationsShell
      pill={membershipEditorPill}
      label="Subscription management"
      title="Membership & pricing editor"
    >
      <MembershipEditor plans={plans} onSavePlan={updatePlan} />
    </AdminOperationsShell>
  )
}
