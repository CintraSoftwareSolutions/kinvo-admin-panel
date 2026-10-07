import type { PriorityCase, QueueOwner } from '../types/contentModeration.types'

export const priorityCasesMock: PriorityCase[] = [
  {
    id: 'priority-david-kim',
    name: 'David Kim',
    reason: 'Spam or Scam',
    mode: 'Trading',
    description: 'Repeated external payment links shared across multiple conversations.',
    severity: 'High',
  },
  {
    id: 'priority-maya-rivera',
    name: 'Maya Rivera',
    reason: 'Boundary concern',
    mode: 'Cuddle',
    description: 'Conversation escalated after the other user requested the plan stay hidden.',
    severity: 'Medium',
  },
]

export const queueOwnersMock: QueueOwner[] = [
  { id: 'ayesha-khan', name: 'Ayesha Khan', location: 'Karachi', lane: 'Reports', badge: '12 active' },
  { id: 'jon-park', name: 'Jon Park', location: 'Seoul', lane: 'Verification', badge: '9 active' },
  { id: 'maria-silva', name: 'Maria Silva', location: 'Lisbon', lane: 'Revenue ops', badge: '3 launches' },
]
