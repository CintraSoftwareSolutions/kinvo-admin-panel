import { useActionGate } from '../../../auth/hooks/usePermissions'
import { ErrorState } from '../../../../shared/components/ErrorState'
import { InlineError } from '../../../../shared/components/InlineError'
import { Skeleton } from '../../../../shared/components/Skeleton'
import { appIcons } from '../../../../shared/icons/appIcons'
import { useRolePermissions, useSetRolePermissions } from '../../api/userManagement.api'
import type { AdminRole, Permission } from '../../types/userManagement.types'
import { PermissionRow } from './PermissionRow'

const PermissionsIcon = appIcons.userManagement.permissions

type PermissionsPanelProps = {
  role: AdminRole
}

export function PermissionsPanel({ role }: PermissionsPanelProps) {
  const permissionsQuery = useRolePermissions(role.id)
  const setPermissions = useSetRolePermissions()
  const gate = useActionGate()('roles.write')

  function handleToggle(target: Permission) {
    const permissions = (permissionsQuery.data ?? []).map((permission) => ({
      key: permission.key,
      allowed: permission.key === target.key ? !permission.allowed : permission.allowed,
    }))
    setPermissions.mutate({ roleId: role.id, permissions })
  }

  return (
    <div className="rounded-3xl border border-slate-300 bg-slate-50 p-4">
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-300 pb-5">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-950">{role.title}</h3>
          {role.description ? <p className="mt-1 text-xs text-slate-500">{role.description}</p> : null}
        </div>
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <PermissionsIcon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <InlineError error={setPermissions.error} className="mb-3" />
      {permissionsQuery.isPending ? (
        <div className="grid gap-3 xl:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-20" />
          ))}
        </div>
      ) : permissionsQuery.error ? (
        <ErrorState error={permissionsQuery.error} onRetry={() => void permissionsQuery.refetch()} />
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {permissionsQuery.data.map((permission) => (
            <PermissionRow
              key={permission.id}
              permission={permission}
              onToggle={() => handleToggle(permission)}
              disabled={!gate.allowed || setPermissions.isPending}
              disabledReason={gate.reason}
            />
          ))}
        </div>
      )}
    </div>
  )
}
