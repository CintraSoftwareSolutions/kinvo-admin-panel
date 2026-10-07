import { appIcons } from '../../../../shared/icons/appIcons'
import { cn } from '../../../../shared/utils/cn'
import type { AdminRole } from '../../types/userManagement.types'

const roleIcons = appIcons.userManagement.roleCards
const FallbackRoleIcon = appIcons.userManagement.roleSelector.users

type RoleSelectorProps = {
  roles: AdminRole[]
  selectedRoleId: string | null
  onRoleChange: (roleId: string) => void
}

export function RoleSelector({ roles, selectedRoleId, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {roles.map((role) => {
        const Icon = roleIcons[role.key] ?? FallbackRoleIcon
        const active = role.id === selectedRoleId
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onRoleChange(role.id)}
            aria-pressed={active}
            className={cn(
              'flex cursor-pointer items-center gap-4 rounded-[22px] border p-4 text-left transition',
              active ? 'border-violet-600 bg-violet-50' : 'border-slate-300 bg-slate-50 hover:border-violet-300 hover:bg-white',
            )}
          >
            <span
              className={cn(
                'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                active ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-700',
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-950">{role.title}</span>
              <span className="mt-1 block text-xs font-medium text-slate-400">
                {role.admins} members | {role.rights} rights{role.is_system ? ' | system' : ''}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
