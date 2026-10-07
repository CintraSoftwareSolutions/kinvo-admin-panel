import { AnimatedNumber, getAnimatedNumberParts } from '../../../../shared/components/AnimatedNumber'
import { EmptyState } from '../../../../shared/components/EmptyState'
import type { AcquisitionMetric } from '../../types/analyticsDashboard.types'

type AcquisitionChannelsProps = {
  metrics: AcquisitionMetric[]
}

export function AcquisitionChannels({ metrics }: AcquisitionChannelsProps) {
  if (metrics.length === 0) {
    return <EmptyState className="mt-6" />
  }

  return (
    <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-2">
      {metrics.map((metric) => {
        const animatedValue = getAnimatedNumberParts(metric.value)

        return (
          <article key={metric.label} className="min-w-0 rounded-[22px] border border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">{metric.label}</p>
            {animatedValue ? (
              <AnimatedNumber {...animatedValue} className="mt-4 block text-3xl font-semibold text-slate-950" />
            ) : (
              <p className="mt-4 text-3xl font-semibold text-slate-950">{metric.value}</p>
            )}
          </article>
        )
      })}
    </div>
  )
}
