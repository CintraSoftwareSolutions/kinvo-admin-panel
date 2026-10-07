import { PillTabs } from '../../../shared/components/PillTabs'
import { appIcons } from '../../../shared/icons/appIcons'
import type { AnalyticsTab } from '../types/analyticsDashboard.types'

type AnalyticsTabsProps = {
  activeTab: AnalyticsTab
  onChange: (tab: AnalyticsTab) => void
}

const tabs = [
  { value: 'engagement', label: 'Engagement', icon: appIcons.analyticsDashboard.engagement },
  { value: 'monetization', label: 'Monetization', icon: appIcons.analyticsDashboard.monetization },
  { value: 'retention', label: 'Retention', icon: appIcons.analyticsDashboard.retention },
  { value: 'channels', label: 'Channels', icon: appIcons.analyticsDashboard.channels },
] satisfies Array<{ value: AnalyticsTab; label: string; icon: typeof appIcons.analyticsDashboard.engagement }>

export function AnalyticsTabs({ activeTab, onChange }: AnalyticsTabsProps) {
  return <PillTabs tabs={tabs} activeTab={activeTab} onChange={onChange} />
}
