import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ErrorState } from '../../../shared/components/ErrorState'
import { PageShell } from '../../../shared/components/PageShell'
import { Skeleton } from '../../../shared/components/Skeleton'
import { formatDateTime } from '../../../shared/utils/formatDate'
import { AnalyticsTabs } from '../components/AnalyticsTabs'
import { ChannelsView } from '../components/Channels/ChannelsView'
import { EngagementView } from '../components/Engagement/EngagementView'
import { MonetizationView } from '../components/Monetization/MonetizationView'
import { RetentionView } from '../components/Retention/RetentionView'
import { matchesQuery, useAnalyticsDashboard } from '../hooks/useAnalyticsDashboard'
import type { AnalyticsTab } from '../types/analyticsDashboard.types'

type AnalyticsDashboardPageProps = {
  searchQuery: string
}

export function AnalyticsDashboardPage({ searchQuery }: AnalyticsDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('engagement')
  const analytics = useAnalyticsDashboard()

  return (
    <PageShell className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AnalyticsTabs activeTab={activeTab} onChange={setActiveTab} />
        {analytics.data ? (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Generated {formatDateTime(analytics.data.generated_at)}</span>
            <button
              type="button"
              onClick={() => void analytics.refetch()}
              disabled={analytics.isFetching}
              className="h-9 rounded-full border border-slate-300 bg-white px-4 font-semibold text-slate-700 transition enabled:hover:border-violet-300 enabled:hover:text-violet-700 disabled:opacity-60"
            >
              {analytics.isFetching ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        ) : null}
      </div>
      {analytics.isPending ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Skeleton className="h-96 rounded-[28px]" />
          <Skeleton className="h-96 rounded-[28px]" />
        </div>
      ) : analytics.error ? (
        <ErrorState error={analytics.error} onRetry={() => void analytics.refetch()} />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="min-w-0 max-w-full overflow-x-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {activeTab === 'engagement' ? (
              <EngagementView engagement={analytics.data.engagement} weeklyResolution={analytics.data.weeklyResolution} />
            ) : null}
            {activeTab === 'monetization' ? (
              <MonetizationView
                subscriptionMix={analytics.data.subscriptionMix}
                revenuePulse={analytics.data.revenuePulse}
                mixRows={analytics.data.subscriptionMix.points.filter((row) => matchesQuery([row.plan], searchQuery))}
                pulseMetrics={analytics.data.revenuePulse.points.filter((metric) => matchesQuery([metric.label], searchQuery))}
              />
            ) : null}
            {activeTab === 'retention' ? (
              <RetentionView
                churnByBilling={analytics.data.churnByBilling}
                subscriptionMix={analytics.data.subscriptionMix}
                rows={analytics.data.subscriptionMix.points.filter((row) => matchesQuery([row.plan], searchQuery))}
              />
            ) : null}
            {activeTab === 'modes' ? (
              <ChannelsView
                modePerformance={analytics.data.modePerformance}
                signInMethods={analytics.data.acquisitionChannels}
                modeRows={analytics.data.modePerformance.points.filter((row) => matchesQuery([row.mode, row.trustScore], searchQuery))}
                signInMetrics={analytics.data.acquisitionChannels.points.filter((metric) => matchesQuery([metric.label], searchQuery))}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      )}
    </PageShell>
  )
}
