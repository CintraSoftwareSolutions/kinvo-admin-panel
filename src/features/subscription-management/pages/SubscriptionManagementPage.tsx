import { AdminOperationsShell } from '../../../shared/components/AdminOperationsShell'
import { ErrorState } from '../../../shared/components/ErrorState'
import { Skeleton } from '../../../shared/components/Skeleton'
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
  const { plans, isPending, error, refetch } = useSubscriptionPlans(searchQuery)

  return (
    <AdminOperationsShell pill={membershipEditorPill} label="Subscription management" title="Membership & pricing editor">
      <p className="-mt-3 mb-5 text-xs text-slate-500">
        A catalogue editor: changes here do not charge, refund or grant access to anybody. Payments are handled outside this
        system.
      </p>
      {isPending ? (
        <div className="grid gap-4 min-[1180px]:grid-cols-2">
          <Skeleton className="h-96 rounded-[22px]" />
          <Skeleton className="h-96 rounded-[22px]" />
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : (
        <MembershipEditor plans={plans} />
      )}
    </AdminOperationsShell>
  )
}
