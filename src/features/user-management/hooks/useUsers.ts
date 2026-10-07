import { useMemo } from 'react'
import { usersMock } from '../data/users.mock'
import type { User } from '../types/userManagement.types'

function matchesUser(user: User, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return [user.name, user.email, user.plan, user.mode, user.status, user.risk]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery)
}

export function useUsers(query: string) {
  return useMemo(() => usersMock.filter((user) => matchesUser(user, query)), [query])
}
