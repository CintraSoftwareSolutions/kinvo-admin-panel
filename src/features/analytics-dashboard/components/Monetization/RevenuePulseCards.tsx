import { AnimatedNumber } from '../../../../shared/components/AnimatedNumber'
import { EmptyState } from '../../../../shared/components/EmptyState'
import { formatMinor } from '../../../../shared/utils/formatCurrency'
import type { RevenueMetric } from '../../types/analyticsDashboard.types'

type RevenuePulseCardsProps = {
  metrics: RevenueMetric[]
}

export function RevenuePulseCards({ metrics }: RevenuePulseCardsProps) {
  if (metrics.length === 0) {
    return <EmptyState className="mt-6" />
  }

  return (
    <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-2">
      {metrics.map((metric) => (
        <article key={metric.label} className="min-w-0 rounded-[22px] border border-slate-300 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-950">{metric.label}</p>
          <MetricValue metric={metric} />
        </article>
      ))}
    </div>
  )
}

/** Read the integer amount_minor for money and the number for percentages; value is a fallback. */
function MetricValue({ metric }: { metric: RevenueMetric }) {
  const className = 'mt-4 block text-3xl font-semibold text-slate-950'

  if (metric.amount_minor !== null && metric.currency) {
    return <p className={className}>{formatMinor(metric.amount_minor, metric.currency)}</p>
  }

  if (metric.percent !== null) {
    return <AnimatedNumber value={metric.percent} decimals={Number.isInteger(metric.percent) ? 0 : 1} suffix="%" className={className} />
  }

  return <p className={className}>{metric.value}</p>
}
