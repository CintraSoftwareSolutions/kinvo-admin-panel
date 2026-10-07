import { appIcons } from '../../../../shared/icons/appIcons'
import { getPermissionsForRole, getRoleById, type RoleId } from '../../data/roles.mock'
import { PermissionRow } from './PermissionRow'

const PermissionsIcon = appIcons.userManagement.permissions

type PermissionsPanelProps = {
  selectedRoleId: RoleId
}

export function PermissionsPanel({ selectedRoleId }: PermissionsPanelProps) {
  const selectedRole = getRoleById(selectedRoleId)
  const permissions = getPermissionsForRole(selectedRoleId)

  return (
    <div className="rounded-3xl border border-slate-300 bg-slate-50 p-4">
      <div className="mb-5 flex items-center justify-between border-b border-slate-300 pb-5">
        <h3 className="font-semibold text-slate-950">{selectedRole.title}</h3>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <PermissionsIcon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        {permissions.map((permission) => (
          <PermissionRow key={permission.id} permission={permission} />
        ))}
      </div>
    </div>
  )
}
