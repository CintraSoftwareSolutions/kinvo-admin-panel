import { AnimatedNumber, getAnimatedNumberParts } from '../../../../shared/components/AnimatedNumber'
import { queueHealthMock } from '../../data/playbook.mock'

export function QueueHealth() {
  return (
    <div className="grid gap-3">
      {queueHealthMock.map((item) => {
        const animatedValue = getAnimatedNumberParts(item.value)

        return (
          <article key={item.label} className="rounded-[22px] border border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">{item.label}</p>
            {item.label === 'Queue policy' ? (
              <p className="mt-5 text-sm leading-6 text-slate-600">{item.value}</p>
            ) : animatedValue ? (
              <AnimatedNumber {...animatedValue} className="mt-5 block text-3xl font-semibold text-slate-950" />
            ) : (
              <p className="mt-5 text-3xl font-semibold text-slate-950">{item.value}</p>
            )}
          </article>
        )
      })}
    </div>
  )
}
