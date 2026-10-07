import { SectionCard } from '../../../../shared/components/SectionCard'
import type { EngagementPoint, Series, WeeklyResolutionPoint } from '../../types/analyticsDashboard.types'
import { BasisNote } from '../BasisNote'
import { ActiveVsVerifiedChart } from './ActiveVsVerifiedChart'
import { WeeklyResolutionChart } from './WeeklyResolutionChart'

type EngagementViewProps = {
  engagement: Series<EngagementPoint>
  weeklyResolution: Series<WeeklyResolutionPoint>
}

export function EngagementView({ engagement, weeklyResolution }: EngagementViewProps) {
  return (
    <div className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Engagement</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Account base vs verified (month end)</h2>
        <BasisNote basis={engagement.basis} />
        <ActiveVsVerifiedChart data={engagement.points} />
      </SectionCard>
      <SectionCard className="min-w-0 max-w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Velocity</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Weekly report resolution</h2>
        <BasisNote basis={weeklyResolution.basis} />
        <WeeklyResolutionChart data={weeklyResolution.points} />
      </SectionCard>
    </div>
  )
}
