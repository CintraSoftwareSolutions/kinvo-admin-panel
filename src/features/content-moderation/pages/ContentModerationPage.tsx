import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PageShell } from '../../../shared/components/PageShell'
import { SectionCard } from '../../../shared/components/SectionCard'
import { ContentModerationTabs } from '../components/ContentModerationTabs'
import { PriorityCases } from '../components/Escalations/PriorityCases'
import { QueueOwners } from '../components/Escalations/QueueOwners'
import { ReportedCategoriesTable } from '../components/Insights/ReportedCategoriesTable'
import { WeeklyReportLoadChart } from '../components/Insights/WeeklyReportLoadChart'
import { EscalationChecklist } from '../components/Playbook/EscalationChecklist'
import { QueueHealth } from '../components/Playbook/QueueHealth'
import { SafetyReportsTable } from '../components/Queue/SafetyReportsTable'
import { useModerationReports } from '../hooks/useModerationReports'
import type { ContentModerationTab } from '../types/contentModeration.types'

type ContentModerationPageProps = {
  searchQuery: string
}

export function ContentModerationPage({ searchQuery }: ContentModerationPageProps) {
  const [activeTab, setActiveTab] = useState<ContentModerationTab>('queue')
  const reports = useModerationReports(searchQuery)

  return (
    <PageShell className="space-y-4">
      <ContentModerationTabs activeTab={activeTab} onChange={setActiveTab} />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          {activeTab === 'queue' ? <QueuePanel reports={reports} /> : null}
          {activeTab === 'playbook' ? <PlaybookPanel /> : null}
          {activeTab === 'escalations' ? <EscalationsPanel /> : null}
          {activeTab === 'insights' ? <InsightsPanel /> : null}
        </motion.div>
      </AnimatePresence>
    </PageShell>
  )
}

type QueuePanelProps = {
  reports: ReturnType<typeof useModerationReports>
}

function QueuePanel({ reports }: QueuePanelProps) {
  return (
    <SectionCard className="min-h-[calc(100vh-170px)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Active queue</p>
      <h2 className="mt-3 text-base font-semibold text-slate-950">Safety reports</h2>
      <div className="mt-6">
        <SafetyReportsTable reports={reports} />
      </div>
    </SectionCard>
  )
}

function PlaybookPanel() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <SectionCard className="min-h-[430px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">SLA</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Queue health</h2>
        <div className="mt-6">
          <QueueHealth />
        </div>
      </SectionCard>
      <SectionCard className="min-h-[430px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Playbook</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Escalation checklist</h2>
        <EscalationChecklist />
      </SectionCard>
    </div>
  )
}

function EscalationsPanel() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <SectionCard>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Escalation lane</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Priority cases</h2>
        <div className="mt-6">
          <PriorityCases />
        </div>
      </SectionCard>
      <SectionCard>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">On-call routing</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Who owns the queue</h2>
        <div className="mt-6">
          <QueueOwners />
        </div>
      </SectionCard>
    </div>
  )
}

function InsightsPanel() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <SectionCard>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Volume trends</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Weekly report load</h2>
        <WeeklyReportLoadChart />
      </SectionCard>
      <SectionCard>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Top reasons</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Most reported categories</h2>
        <ReportedCategoriesTable />
      </SectionCard>
    </div>
  )
}
