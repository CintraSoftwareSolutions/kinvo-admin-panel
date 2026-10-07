import type { SnapshotData } from '../types/userManagement.types'

export const userSnapshotMock: SnapshotData = {
  metrics: [
    { label: 'Visible users', value: 8, tone: 'purple' },
    { label: 'Premium members', value: 3, tone: 'emerald' },
    { label: 'Flagged accounts', value: 1, tone: 'rose' },
    { label: 'Avg matches', value: 20, tone: 'blue' },
  ],
  statusCounts: [
    { label: 'Active', value: 3 },
    { label: 'Premium', value: 3 },
    { label: 'Inactive', value: 1 },
    { label: 'Flagged', value: 1 },
  ],
  topModes: [
    { label: 'Dating', value: '1 active' },
    { label: 'Networking', value: '1 active' },
    { label: 'Study Buddy', value: '1 active' },
    { label: 'Trading', value: '1 active' },
  ],
  paymentHealth: [
    { label: 'Paid', value: 5 },
    { label: 'Pending', value: 2 },
    { label: 'Failed', value: 1 },
  ],
  highValueMembers: [
    { name: 'Sarah Mitchell', detail: 'Premium Monthly', value: 120 },
    { name: 'Olivia Hart', detail: 'Foodie Club', value: 110, avatar: '/images/Olivia Hart.png' },
    { name: 'Marcus Green', detail: 'Pro Networking', value: 90, avatar: '/images/sameer.png' },
    { name: 'Noah Bennett', detail: 'Pet Plus', value: 84, avatar: '/images/Noah Bennett.png' },
  ],
  attentionQueue: [
    { name: 'Emma Wilson', detail: 'Study Buddy | Pending', risk: 'Medium' },
    { name: 'David Kim', detail: 'Trading | Failed', risk: 'High' },
    { name: 'Maya Rivera', detail: 'Cuddle | Pending', risk: 'Medium' },
  ],
  recentAccountEvents: [
    { name: 'Sarah Mitchell', event: 'Date plan confirmed' },
    { name: 'Marcus Green', event: 'Networking intro shared' },
    { name: 'Emma Wilson', event: 'Study session rescheduled' },
    { name: 'David Kim', event: 'Outbound payment link blocked' },
  ],
}
