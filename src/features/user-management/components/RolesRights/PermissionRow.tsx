import { appIcons, type AppIcon } from '../../../../shared/icons/appIcons'
import { cn } from '../../../../shared/utils/cn'
import type { Permission } from '../../types/userManagement.types'

type PermissionRowProps = {
  permission: Permission
}

function getPermissionIcon(permissionId: string): AppIcon {
  return appIcons.userManagement.permissionItems[permissionId] ?? appIcons.userManagement.permissions
}

export function PermissionRow({ permission }: PermissionRowProps) {
  const PermissionIcon = getPermissionIcon(permission.id)
  const StateIcon = permission.allowed
    ? appIcons.userManagement.permissionState.allowed
    : appIcons.userManagement.permissionState.blocked

  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-slate-300 bg-white p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <PermissionIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-950">{permission.title}</p>
          <p className="mt-1 text-xs text-slate-500">{permission.description}</p>
        </div>
      </div>
      <span
        className={cn(
          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
          permission.allowed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-red-600',
        )}
      >
        <StateIcon className="h-4 w-4" aria-hidden="true" />
      </span>
    </div>
  )
}
