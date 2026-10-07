import { SectionCard } from '../../../../shared/components/SectionCard'
import type { ChurnPoint, RenewalConfidenceRow } from '../../types/analyticsDashboard.types'
import { PlanChurnChart } from './PlanChurnChart'
import { RenewalConfidenceTable } from './RenewalConfidenceTable'

type RetentionViewProps = {
  churnByBilling: ChurnPoint[]
  renewalConfidence: RenewalConfidenceRow[]
}

export function RetentionView({ churnByBilling, renewalConfidence }: RetentionViewProps) {
  return (
    <div className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Retention</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Plan churn by billing cycle</h2>
        <PlanChurnChart data={churnByBilling} />
      </SectionCard>
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Renewal outlook</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Plan-level renewal confidence</h2>
        <RenewalConfidenceTable rows={renewalConfidence} />
      </SectionCard>
    </div>
  )
}
