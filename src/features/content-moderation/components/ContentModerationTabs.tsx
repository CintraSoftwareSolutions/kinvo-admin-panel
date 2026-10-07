import { PillTabs } from '../../../shared/components/PillTabs'
import { appIcons } from '../../../shared/icons/appIcons'
import type { ContentModerationTab } from '../types/contentModeration.types'

type ContentModerationTabsProps = {
  activeTab: ContentModerationTab
  onChange: (tab: ContentModerationTab) => void
}

const tabs = [
  { value: 'queue', label: 'Queue', icon: appIcons.contentModeration.queue },
  { value: 'playbook', label: 'Playbook', icon: appIcons.contentModeration.playbook },
  { value: 'escalations', label: 'Escalations', icon: appIcons.contentModeration.escalations },
  { value: 'insights', label: 'Insights', icon: appIcons.contentModeration.insights },
] satisfies Array<{ value: ContentModerationTab; label: string; icon: typeof appIcons.contentModeration.queue }>

export function ContentModerationTabs({ activeTab, onChange }: ContentModerationTabsProps) {
  return <PillTabs tabs={tabs} activeTab={activeTab} onChange={onChange} />
}
