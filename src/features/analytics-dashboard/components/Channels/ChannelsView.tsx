import { SectionCard } from '../../../../shared/components/SectionCard'
import type { AcquisitionMetric, ModePerformanceRow } from '../../types/analyticsDashboard.types'
import { AcquisitionChannels } from './AcquisitionChannels'
import { ModePerformanceTable } from './ModePerformanceTable'

type ChannelsViewProps = {
  modePerformance: ModePerformanceRow[]
  acquisitionChannels: AcquisitionMetric[]
}

export function ChannelsView({ modePerformance, acquisitionChannels }: ChannelsViewProps) {
  return (
    <div className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Mode analysis</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Mode performance</h2>
        <ModePerformanceTable rows={modePerformance} />
      </SectionCard>
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Acquisition channels</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Where growth is coming from</h2>
        <AcquisitionChannels metrics={acquisitionChannels} />
      </SectionCard>
    </div>
  )
}
