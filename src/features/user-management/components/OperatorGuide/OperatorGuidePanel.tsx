import { SectionCard } from '../../../../shared/components/SectionCard'
import { appIcons } from '../../../../shared/icons/appIcons'
import { Skeleton } from '../../../../shared/components/Skeleton'
import { useUserSnapshot } from '../../api/userManagement.api'
import { HighValueMembers } from '../Snapshot/HighValueMembers'

const guideCards = [
  {
    title: 'What this table controls',
    icon: appIcons.userManagement.operatorGuideCards.search,
  },
  {
    title: 'How sorting works',
    icon: appIcons.userManagement.operatorGuideCards.sorting,
  },
  {
    title: 'Fast operator loop',
    icon: appIcons.userManagement.operatorGuideCards.loop,
  },
]

const OperatorLoopIcon = appIcons.userManagement.operatorGuideCards.loop

export function OperatorGuidePanel() {
  const snapshot = useUserSnapshot()

  return (
    <SectionCard className="min-h-[calc(100vh-170px)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Guide</p>
      <h2 className="mt-3 text-base font-semibold text-slate-950">User workspace guide</h2>
      <div className="mt-6 grid gap-3 xl:grid-cols-2">
        {guideCards.slice(0, 2).map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="flex items-center gap-4 rounded-[22px] border border-slate-300 bg-slate-50 p-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="font-semibold text-slate-950">{card.title}</p>
            </div>
          )
        })}
        <div className="min-h-56 rounded-[22px] border border-slate-300 bg-slate-50 p-4">
          <div className="mb-5 flex items-center gap-4">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <OperatorLoopIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="font-semibold text-slate-950">Fast operator loop</p>
          </div>
        </div>
        <div className="rounded-[22px] border border-slate-300 bg-slate-50 p-4">
          <p className="mb-5 font-semibold text-slate-950">Highest value members</p>
          {snapshot.data ? (
            <HighValueMembers members={snapshot.data.highValueMembers} compact />
          ) : (
            <Skeleton className="h-40" />
          )}
        </div>
      </div>
    </SectionCard>
  )
}
