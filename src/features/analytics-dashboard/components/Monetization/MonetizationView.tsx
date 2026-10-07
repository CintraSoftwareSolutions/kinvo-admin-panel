import { SectionCard } from '../../../../shared/components/SectionCard'
import type { RevenueMetric, Series, SubscriptionMixRow } from '../../types/analyticsDashboard.types'
import { BasisNote } from '../BasisNote'
import { RevenuePulseCards } from './RevenuePulseCards'
import { SubscriptionMixTable } from './SubscriptionMixTable'

type MonetizationViewProps = {
  subscriptionMix: Series<SubscriptionMixRow>
  revenuePulse: Series<RevenueMetric>
  mixRows: SubscriptionMixRow[]
  pulseMetrics: RevenueMetric[]
}

export function MonetizationView({ subscriptionMix, revenuePulse, mixRows, pulseMetrics }: MonetizationViewProps) {
  return (
    <div className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Monetization</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Subscription mix</h2>
        <BasisNote basis={subscriptionMix.basis} />
        <SubscriptionMixTable rows={mixRows} />
      </SectionCard>
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Revenue pulse</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">MRR and payment health</h2>
        <BasisNote basis={revenuePulse.basis} />
        <RevenuePulseCards metrics={pulseMetrics} />
      </SectionCard>
    </div>
  )
}
