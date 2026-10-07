import { AnimatedNumber } from '../../../../shared/components/AnimatedNumber'
import { EmptyState } from '../../../../shared/components/EmptyState'
import { formatNumber } from '../../../../shared/utils/formatNumber'
import type { SignInMethodMetric } from '../../types/analyticsDashboard.types'

type AcquisitionChannelsProps = {
  metrics: SignInMethodMetric[]
}

/** Sign-in method of each account's first identity. This is not where users came from. */
export function AcquisitionChannels({ metrics }: AcquisitionChannelsProps) {
  if (metrics.length === 0) {
    return <EmptyState className="mt-6" />
  }

  return (
    <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-2">
      {metrics.map((metric) => (
        <article key={metric.label} className="min-w-0 rounded-[22px] border border-slate-300 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-950">{metric.label}</p>
          <AnimatedNumber
            value={metric.percent}
            decimals={Number.isInteger(metric.percent) ? 0 : 1}
            suffix="%"
            className="mt-4 block text-3xl font-semibold text-slate-950"
          />
          <p className="mt-1 text-xs text-slate-500">{formatNumber(metric.users)} accounts</p>
        </article>
      ))}
    </div>
  )
}
