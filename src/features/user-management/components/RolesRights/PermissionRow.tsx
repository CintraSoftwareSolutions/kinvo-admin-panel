import { appIcons } from '../../../../shared/icons/appIcons'
import { cn } from '../../../../shared/utils/cn'
import type { Permission } from '../../types/userManagement.types'

type PermissionRowProps = {
  permission: Permission
  onToggle?: () => void
  disabled?: boolean
  disabledReason?: string
}

const permissionIcons = appIcons.userManagement.permissionItems
const FallbackPermissionIcon = appIcons.userManagement.permissions
const AllowedIcon = appIcons.userManagement.permissionState.allowed
const BlockedIcon = appIcons.userManagement.permissionState.blocked

export function PermissionRow({ permission, onToggle, disabled, disabledReason }: PermissionRowProps) {
  const PermissionIcon = permissionIcons[permission.key] ?? FallbackPermissionIcon

  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-slate-300 bg-white p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <PermissionIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-950">{permission.title}</p>
          <p className="mt-1 text-xs text-slate-500">{permission.description}</p>
          <p className="mt-1 font-mono text-[11px] text-slate-400">{permission.key}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={permission.allowed}
        aria-label={`${permission.allowed ? 'Revoke' : 'Grant'} ${permission.title}`}
        title={disabled ? disabledReason : permission.allowed ? 'Allowed — click to revoke' : 'Blocked — click to grant'}
        disabled={disabled || !onToggle}
        onClick={onToggle}
        className={cn(
          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition enabled:hover:ring-2 enabled:hover:ring-violet-200 disabled:cursor-not-allowed',
          permission.allowed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-red-600',
        )}
      >
        {permission.allowed ? <AllowedIcon className="h-4 w-4" aria-hidden="true" /> : <BlockedIcon className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  )
}
