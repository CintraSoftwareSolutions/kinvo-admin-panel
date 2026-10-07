import { useMemo } from 'react'
import { membershipsMock } from '../data/memberships.mock'
import { usersMock } from '../data/users.mock'
import type { Membership, User } from '../types/userManagement.types'

export type MembershipRow = Membership & {
  user: User
}

function findUser(userId: string) {
  const user = usersMock.find((candidate) => candidate.id === userId)
  if (!user) {
    throw new Error(`Missing mock user for ${userId}`)
  }
  return user
}

function matchesMembership(row: MembershipRow, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return [
    row.user.name,
    row.user.email,
    row.subscriptionPlan,
    row.paymentMethod,
    row.paymentStatus,
    row.renewalDate,
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery)
}

export function useUserMemberships(query: string) {
  return useMemo(() => {
    const rows = membershipsMock.map((membership) => ({
      ...membership,
      user: findUser(membership.userId),
    }))

    return rows.filter((row) => matchesMembership(row, query))
  }, [query])
}
