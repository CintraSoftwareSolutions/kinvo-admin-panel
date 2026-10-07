import { AnimatedNumber } from '../../../../shared/components/AnimatedNumber'
import { getAnimatedNumberParts } from '../../../../shared/utils/animatedNumberParts'
import type { QueueHealthMetric } from '../../types/contentModeration.types'

export function QueueHealth({ metrics }: { metrics: QueueHealthMetric[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {metrics.map((item) => {
        const animatedValue = getAnimatedNumberParts(item.value)

        return (
          <article key={item.label} className="rounded-[22px] border border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">{item.label}</p>
            {animatedValue ? (
              <AnimatedNumber {...animatedValue} className="mt-5 block text-3xl font-semibold text-slate-950" />
            ) : (
              <p className="mt-5 text-3xl font-semibold text-slate-950">{item.value}</p>
            )}
            {item.description ? <p className="mt-2 text-xs text-slate-500">{item.description}</p> : null}
          </article>
        )
      })}
    </div>
  )
}
