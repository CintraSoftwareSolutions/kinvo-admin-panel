import { useMemo } from 'react'
import { activityMock } from '../data/activity.mock'
import { usersMock } from '../data/users.mock'
import type { ActivityHistory, User } from '../types/userManagement.types'

export type ActivityRow = ActivityHistory & {
  user: User
}

function findUser(userId: string) {
  const user = usersMock.find((candidate) => candidate.id === userId)
  if (!user) {
    throw new Error(`Missing mock user for ${userId}`)
  }
  return user
}

function matchesActivity(row: ActivityRow, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return [
    row.user.name,
    row.user.email,
    row.recentAction,
    row.trustEvent,
    row.planEvent,
    row.state,
    row.lastActive,
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery)
}

export function useUserActivity(query: string) {
  return useMemo(() => {
    const rows = activityMock.map((activity) => ({
      ...activity,
      user: findUser(activity.userId),
    }))

    return rows.filter((row) => matchesActivity(row, query))
  }, [query])
}
