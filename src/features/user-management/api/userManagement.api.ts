import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiSend } from '../../../api/client'
import type {
  ActivityHistory,
  AdminRole,
  Membership,
  Permission,
  SnapshotData,
  StaffRole,
  UserDetail,
} from '../types/userManagement.types'

export const userKeys = {
  all: ['admin', 'users'] as const,
  list: ['admin', 'users', 'list'] as const,
  detail: (id: string) => ['admin', 'users', 'detail', id] as const,
  membership: (id: string) => ['admin', 'users', 'membership', id] as const,
  activity: (id: string) => ['admin', 'users', 'activity', id] as const,
  snapshot: ['admin', 'users', 'snapshot'] as const,
  audit: ['admin', 'audit-log'] as const,
  roles: ['admin', 'roles'] as const,
  rolePermissions: (id: string) => ['admin', 'roles', id, 'permissions'] as const,
}

export function useUserDetail(id: string | null) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ''),
    enabled: Boolean(id),
    queryFn: ({ signal }) => apiGet<{ user: UserDetail }>(`/admin/users/${id}`, undefined, signal),
    select: (data) => data.user,
  })
}

export function useUserMembership(id: string | null) {
  return useQuery({
    queryKey: userKeys.membership(id ?? ''),
    enabled: Boolean(id),
    queryFn: ({ signal }) => apiGet<{ memberships: Membership[] }>(`/admin/users/${id}/membership`, undefined, signal),
    select: (data) => data.memberships,
  })
}

export function useUserActivityLog(id: string | null) {
  return useQuery({
    queryKey: userKeys.activity(id ?? ''),
    enabled: Boolean(id),
    queryFn: ({ signal }) =>
      apiGet<{ activity: ActivityHistory[] }>(`/admin/users/${id}/activity`, { limit: 20 }, signal),
    select: (data) => data.activity,
  })
}

export function useUserSnapshot() {
  return useQuery({
    queryKey: userKeys.snapshot,
    queryFn: ({ signal }) => apiGet<SnapshotData>('/admin/users/snapshot', undefined, signal),
  })
}

function useInvalidateUsers() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: userKeys.all })
}

export function useSuspendUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiSend<unknown>('POST', `/admin/users/${id}/suspend`, { reason }),
    onSuccess: invalidate,
  })
}

export function useReinstateUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: ({ id }: { id: string }) => apiSend<unknown>('POST', `/admin/users/${id}/reinstate`),
    onSuccess: invalidate,
  })
}

export function useChangeUserRole() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: StaffRole }) =>
      apiSend<unknown>('PATCH', `/admin/users/${id}/role`, { role }),
    onSuccess: invalidate,
  })
}

export function useAdminRoles() {
  return useQuery({
    queryKey: userKeys.roles,
    queryFn: ({ signal }) => apiGet<{ roles: AdminRole[] }>('/admin/roles', undefined, signal),
    select: (data) => data.roles,
  })
}

export function useRolePermissions(roleId: string | null) {
  return useQuery({
    queryKey: userKeys.rolePermissions(roleId ?? ''),
    enabled: Boolean(roleId),
    queryFn: ({ signal }) =>
      apiGet<{ permissions: Permission[] }>(`/admin/roles/${roleId}/permissions`, undefined, signal),
    select: (data) => data.permissions,
  })
}

export function useSetRolePermissions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: string; permissions: Array<{ key: string; allowed: boolean }> }) =>
      apiSend<unknown>('PUT', `/admin/roles/${roleId}/permissions`, { permissions }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: userKeys.roles }),
  })
}
