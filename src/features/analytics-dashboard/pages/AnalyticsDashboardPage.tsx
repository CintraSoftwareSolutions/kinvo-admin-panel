import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PageShell } from '../../../shared/components/PageShell'
import { AnalyticsTabs } from '../components/AnalyticsTabs'
import { ChannelsView } from '../components/Channels/ChannelsView'
import { EngagementView } from '../components/Engagement/EngagementView'
import { MonetizationView } from '../components/Monetization/MonetizationView'
import { RetentionView } from '../components/Retention/RetentionView'
import { useAnalyticsDashboard } from '../hooks/useAnalyticsDashboard'
import type { AnalyticsTab } from '../types/analyticsDashboard.types'

type AnalyticsDashboardPageProps = {
  searchQuery: string
}

export function AnalyticsDashboardPage({ searchQuery }: AnalyticsDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('engagement')
  const analytics = useAnalyticsDashboard(searchQuery)

  return (
    <PageShell className="space-y-4">
      <AnalyticsTabs activeTab={activeTab} onChange={setActiveTab} />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="min-w-0 max-w-full overflow-x-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          {activeTab === 'engagement' ? (
            <EngagementView engagement={analytics.engagement} weeklyResolution={analytics.weeklyResolution} />
          ) : null}
          {activeTab === 'monetization' ? (
            <MonetizationView subscriptionMix={analytics.subscriptionMix} revenuePulse={analytics.revenuePulse} />
          ) : null}
          {activeTab === 'retention' ? (
            <RetentionView churnByBilling={analytics.churnByBilling} renewalConfidence={analytics.renewalConfidence} />
          ) : null}
          {activeTab === 'channels' ? (
            <ChannelsView modePerformance={analytics.modePerformance} acquisitionChannels={analytics.acquisitionChannels} />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </PageShell>
  )
}
