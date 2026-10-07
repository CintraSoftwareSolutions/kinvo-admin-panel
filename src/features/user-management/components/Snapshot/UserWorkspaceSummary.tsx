import { AnimatedNumber } from '../../../../shared/components/AnimatedNumber'
import { appIcons } from '../../../../shared/icons/appIcons'
import type { SnapshotData, SnapshotMetric } from '../../types/userManagement.types'

const metricIcons = {
  purple: appIcons.userManagement.metrics.purple,
  emerald: appIcons.userManagement.metrics.emerald,
  rose: appIcons.userManagement.metrics.rose,
  blue: appIcons.userManagement.metrics.blue,
}

const metricStyles = {
  purple: 'bg-violet-100 text-violet-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  rose: 'bg-rose-100 text-rose-600',
  blue: 'bg-blue-100 text-blue-600',
}

function MetricCard({ metric }: { metric: SnapshotMetric }) {
  const Icon = metricIcons[metric.tone]
  return (
    <div className="rounded-[22px] border border-slate-300 bg-slate-50 p-4">
      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${metricStyles[metric.tone]}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">{metric.label}</p>
      <AnimatedNumber value={metric.value} className="mt-3 block text-3xl font-semibold text-slate-950" />
    </div>
  )
}

export function UserWorkspaceSummary({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <div className="grid gap-3 xl:grid-cols-2">
      {snapshot.metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
      <div className="rounded-[22px] border border-slate-300 bg-slate-50 p-4">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Top modes</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {snapshot.topModes.map((mode) => (
            <div key={mode.label} className="rounded-2xl border border-slate-300 bg-white p-3">
              <p className="font-semibold text-slate-950">{mode.label}</p>
              <p className="mt-1 text-xs text-slate-500">{mode.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[22px] border border-slate-300 bg-slate-50 p-4">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Payment health</p>
        <div className="grid gap-2">
          {snapshot.paymentHealth.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-300 bg-white p-3">
              <span className="font-semibold text-slate-950">{item.label}</span>
              <AnimatedNumber value={item.value} className="font-semibold text-violet-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
