import { rolesMock, type RoleId } from '../../data/roles.mock'
import { appIcons, type AppIcon } from '../../../../shared/icons/appIcons'
import { cn } from '../../../../shared/utils/cn'

function getRoleIcon(roleId: string): AppIcon {
  return appIcons.userManagement.roleCards[roleId] ?? appIcons.userManagement.roleSelector.users
}

type RoleSelectorProps = {
  selectedRoleId: RoleId
  onRoleChange: (roleId: RoleId) => void
}

export function RoleSelector({ selectedRoleId, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rolesMock.map((role) => {
        const Icon = getRoleIcon(role.id)
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
                'inline-flex h-11 w-11 items-center justify-center rounded-2xl',
                active ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-700',
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-950">{role.title}</span>
              <span className="mt-1 block text-xs font-medium text-slate-400">
                {role.admins} admins | {role.rights} rights
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
