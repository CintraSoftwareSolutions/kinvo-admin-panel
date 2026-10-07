import { SectionCard } from '../../../../shared/components/SectionCard'
import type { ChurnPoint, Series, SubscriptionMixRow } from '../../types/analyticsDashboard.types'
import { BasisNote } from '../BasisNote'
import { PlanChurnChart } from './PlanChurnChart'
import { RenewalConfidenceTable } from './RenewalConfidenceTable'

type RetentionViewProps = {
  churnByBilling: Series<ChurnPoint>
  subscriptionMix: Series<SubscriptionMixRow>
  rows: SubscriptionMixRow[]
}

export function RetentionView({ churnByBilling, subscriptionMix, rows }: RetentionViewProps) {
  return (
    <div className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Retention</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Cancellations by billing cycle</h2>
        <BasisNote basis={churnByBilling.basis} />
        <PlanChurnChart data={churnByBilling.points} />
      </SectionCard>
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Renewal outlook</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Renewals and lifetime churn by plan</h2>
        <BasisNote basis={subscriptionMix.basis} />
        <RenewalConfidenceTable rows={rows} />
      </SectionCard>
    </div>
  )
}
