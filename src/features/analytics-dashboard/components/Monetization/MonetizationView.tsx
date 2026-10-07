import { SectionCard } from '../../../../shared/components/SectionCard'
import type { RevenueMetric, SubscriptionMixRow } from '../../types/analyticsDashboard.types'
import { RevenuePulseCards } from './RevenuePulseCards'
import { SubscriptionMixTable } from './SubscriptionMixTable'

type MonetizationViewProps = {
  subscriptionMix: SubscriptionMixRow[]
  revenuePulse: RevenueMetric[]
}

export function MonetizationView({ subscriptionMix, revenuePulse }: MonetizationViewProps) {
  return (
    <div className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Monetization</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Subscription mix</h2>
        <SubscriptionMixTable rows={subscriptionMix} />
      </SectionCard>
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Revenue pulse</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">MRR and payment health</h2>
        <RevenuePulseCards metrics={revenuePulse} />
      </SectionCard>
    </div>
  )
}
