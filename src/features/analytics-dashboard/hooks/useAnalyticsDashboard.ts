import { useMemo } from 'react'
import { acquisitionChannelsMock, modePerformanceMock } from '../data/channels.mock'
import { engagementMock, weeklyResolutionMock } from '../data/engagement.mock'
import { revenuePulseMock, subscriptionMixMock } from '../data/monetization.mock'
import { churnByBillingMock, renewalConfidenceMock } from '../data/retention.mock'

function matchesQuery(values: string[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return values.some((value) => value.toLowerCase().includes(normalizedQuery))
}

export function useAnalyticsDashboard(query: string) {
  return useMemo(
    () => ({
      engagement: engagementMock,
      weeklyResolution: weeklyResolutionMock,
      subscriptionMix: subscriptionMixMock.filter((row) =>
        matchesQuery([row.plan, row.active, row.renewed, row.churn], query),
      ),
      revenuePulse: revenuePulseMock.filter((metric) => matchesQuery([metric.label, metric.value], query)),
      churnByBilling: churnByBillingMock,
      renewalConfidence: renewalConfidenceMock.filter((row) => matchesQuery([row.plan, row.renewed, row.churn], query)),
      modePerformance: modePerformanceMock.filter((row) =>
        matchesQuery([row.mode, row.activeUsers, row.completion, row.trustScore], query),
      ),
      acquisitionChannels: acquisitionChannelsMock.filter((metric) => matchesQuery([metric.label, metric.value], query)),
    }),
    [query],
  )
}
