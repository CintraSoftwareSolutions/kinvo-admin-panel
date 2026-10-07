import { SectionCard } from '../../../../shared/components/SectionCard'
import type { ModePerformanceRow, Series, SignInMethodMetric } from '../../types/analyticsDashboard.types'
import { BasisNote } from '../BasisNote'
import { AcquisitionChannels } from './AcquisitionChannels'
import { ModePerformanceTable } from './ModePerformanceTable'

type ChannelsViewProps = {
  modePerformance: Series<ModePerformanceRow>
  signInMethods: Series<SignInMethodMetric>
  modeRows: ModePerformanceRow[]
  signInMetrics: SignInMethodMetric[]
}

export function ChannelsView({ modePerformance, signInMethods, modeRows, signInMetrics }: ChannelsViewProps) {
  return (
    <div className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Mode analysis</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Mode performance</h2>
        <BasisNote basis={modePerformance.basis} />
        <ModePerformanceTable rows={modeRows} />
      </SectionCard>
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Sign-in method</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">How accounts first signed in</h2>
        <BasisNote basis={signInMethods.basis} />
        <AcquisitionChannels metrics={signInMetrics} />
      </SectionCard>
    </div>
  )
}
