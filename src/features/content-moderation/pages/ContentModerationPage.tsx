import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { usePermissions } from '../../auth/hooks/usePermissions'
import { ErrorState } from '../../../shared/components/ErrorState'
import { PageShell } from '../../../shared/components/PageShell'
import { SectionCard } from '../../../shared/components/SectionCard'
import { Skeleton } from '../../../shared/components/Skeleton'
import { Select } from '../../../shared/forms/Select'
import { useEscalations, useModerationInsights } from '../api/contentModeration.api'
import { ContentModerationTabs } from '../components/ContentModerationTabs'
import { PriorityCases } from '../components/Escalations/PriorityCases'
import { QueueOwners } from '../components/Escalations/QueueOwners'
import { ReportedCategoriesTable } from '../components/Insights/ReportedCategoriesTable'
import { WeeklyReportLoadChart } from '../components/Insights/WeeklyReportLoadChart'
import { QueueHealth } from '../components/Playbook/QueueHealth'
import { CaseModal } from '../components/Queue/CaseModal'
import { SafetyReportsTable } from '../components/Queue/SafetyReportsTable'
import { VerificationQueue } from '../components/Verification/VerificationQueue'
import { useModerationReports, type QueueFilters } from '../hooks/useModerationReports'
import type { ContentModerationTab, ModerationReport } from '../types/contentModeration.types'

type ContentModerationPageProps = {
  searchQuery: string
}

export function ContentModerationPage({ searchQuery }: ContentModerationPageProps) {
  const { can } = usePermissions()
  const [activeTab, setActiveTab] = useState<ContentModerationTab>('queue')
  const showVerification = can('verification.read')

  return (
    <PageShell className="space-y-4">
      <ContentModerationTabs activeTab={activeTab} onChange={setActiveTab} showVerification={showVerification} />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          {activeTab === 'queue' ? <QueuePanel searchQuery={searchQuery} /> : null}
          {activeTab === 'verification' && showVerification ? <VerificationPanel /> : null}
          {activeTab === 'escalations' ? <EscalationsPanel /> : null}
          {activeTab === 'insights' ? <InsightsPanel /> : null}
        </motion.div>
      </AnimatePresence>
    </PageShell>
  )
}

const emptyFilters: QueueFilters = { status: '', severity: '', unassigned: false }

function QueuePanel({ searchQuery }: { searchQuery: string }) {
  const [filters, setFilters] = useState<QueueFilters>(emptyFilters)
  const [openCase, setOpenCase] = useState<ModerationReport | null>(null)
  const reports = useModerationReports(searchQuery, filters)

  return (
    <SectionCard className="min-h-[calc(100vh-170px)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Active queue</p>
          <h2 className="mt-3 text-base font-semibold text-slate-950">Safety reports and flags</h2>
          <p className="mt-1 text-xs text-slate-400">
            Oldest first.{searchQuery.trim() ? ' Search filters the cases on this page only.' : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            aria-label="Status"
            value={filters.status}
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value as QueueFilters['status'] }))}
          >
            <option value="">Any status</option>
            <option value="open">Open</option>
            <option value="under_review">Under review</option>
            <option value="actioned">Actioned</option>
            <option value="dismissed">Dismissed</option>
          </Select>
          <Select
            aria-label="Severity"
            value={filters.severity}
            onChange={(event) => setFilters((current) => ({ ...current, severity: event.target.value as QueueFilters['severity'] }))}
          >
            <option value="">Any severity</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
          <label className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={filters.unassigned}
              onChange={(event) => setFilters((current) => ({ ...current, unassigned: event.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            Unassigned only
          </label>
        </div>
      </div>
      <div className="mt-6">
        <SafetyReportsTable
          reports={reports.items}
          loading={reports.isLoading}
          error={reports.error}
          onRetry={() => void reports.refetch()}
          pagination={reports.pagination}
          onOpenCase={setOpenCase}
        />
      </div>
      <CaseModal report={openCase} onClose={() => setOpenCase(null)} />
    </SectionCard>
  )
}

function VerificationPanel() {
  return (
    <SectionCard className="min-h-[calc(100vh-170px)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Identity</p>
      <h2 className="mt-3 text-base font-semibold text-slate-950">Verification reviews</h2>
      <p className="mt-1 text-xs text-slate-400">Oldest first. Documents open in a new tab from a short-lived link.</p>
      <div className="mt-6">
        <VerificationQueue />
      </div>
    </SectionCard>
  )
}

function EscalationsPanel() {
  const escalations = useEscalations()
  const insights = useModerationInsights()

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <SectionCard>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Escalation lane</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Priority cases</h2>
        <div className="mt-6">
          {escalations.isPending ? (
            <Skeleton className="h-48" />
          ) : escalations.error ? (
            <ErrorState error={escalations.error} onRetry={() => void escalations.refetch()} />
          ) : (
            <PriorityCases cases={escalations.data} />
          )}
        </div>
      </SectionCard>
      <SectionCard>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">On-call routing</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Who owns the queue</h2>
        <div className="mt-6">
          {insights.isPending ? (
            <Skeleton className="h-48" />
          ) : insights.error ? (
            <ErrorState error={insights.error} onRetry={() => void insights.refetch()} />
          ) : (
            <QueueOwners owners={insights.data.owners} />
          )}
        </div>
      </SectionCard>
    </div>
  )
}

function InsightsPanel() {
  const insights = useModerationInsights()

  if (insights.isPending) {
    return <Skeleton className="h-96 rounded-[28px]" />
  }

  if (insights.error) {
    return <ErrorState error={insights.error} onRetry={() => void insights.refetch()} />
  }

  return (
    <div className="grid gap-4">
      <SectionCard>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Queue health</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">Where the work stands</h2>
        <div className="mt-6">
          <QueueHealth metrics={insights.data.queueHealth} />
        </div>
      </SectionCard>
      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Volume trends</p>
          <h2 className="mt-3 text-base font-semibold text-slate-950">Weekly report load (12 weeks)</h2>
          <WeeklyReportLoadChart weeks={insights.data.weeklyLoad} />
        </SectionCard>
        <SectionCard>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Top reasons</p>
          <h2 className="mt-3 text-base font-semibold text-slate-950">Most reported categories</h2>
          <ReportedCategoriesTable categories={insights.data.reportedCategories} />
        </SectionCard>
      </div>
    </div>
  )
}
