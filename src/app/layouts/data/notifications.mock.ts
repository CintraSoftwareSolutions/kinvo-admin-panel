import { appIcons } from '../../../shared/icons/appIcons'
import type { AppIcon } from '../../../shared/icons/appIcons'

export type TopbarNotification = {
  id: string
  title: string
  description: string
  time: string
  icon: AppIcon
  tone: 'blue' | 'emerald' | 'orange' | 'rose' | 'violet'
  unread: boolean
}

export const topbarNotificationsMock: TopbarNotification[] = [
  {
    id: 'safety-report',
    title: 'New safety report received',
    description: 'A high-priority moderation report is waiting in the queue.',
    time: '6m ago',
    icon: appIcons.contentModeration.queue,
    tone: 'rose',
    unread: true,
  },
  {
    id: 'flagged-account',
    title: 'David Kim account flagged',
    description: 'Trust signals changed after a new report.',
    time: '18m ago',
    icon: appIcons.userManagement.trustShield,
    tone: 'violet',
    unread: true,
  },
  {
    id: 'payment-failed',
    title: 'Payment failed for one member',
    description: 'A renewal payment needs review in membership tools.',
    time: '42m ago',
    icon: appIcons.userManagement.membership,
    tone: 'orange',
    unread: true,
  },
  {
    id: 'venue-review',
    title: 'Venue suggestion pending review',
    description: 'A new suggested venue is ready for curation.',
    time: '1h ago',
    icon: appIcons.navigation.dateSuggestions,
    tone: 'blue',
    unread: false,
  },
  {
    id: 'weekly-summary',
    title: 'Weekly report summary ready',
    description: 'Analytics insights have been refreshed.',
    time: '2h ago',
    icon: appIcons.analyticsDashboard.channels,
    tone: 'emerald',
    unread: false,
  },
]
