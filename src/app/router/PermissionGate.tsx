import type { ReactNode } from 'react'
import { usePermissions } from '../../features/auth/hooks/usePermissions'
import type { PermissionKey } from '../../features/auth/types/auth.types'
import { PermissionChip } from '../../shared/components/ErrorState'
import { PageShell } from '../../shared/components/PageShell'
import { SectionCard } from '../../shared/components/SectionCard'

type PermissionGateProps = {
  permission: PermissionKey
  children: ReactNode
}

/** Presentation only: the API refuses the calls anyway. This just says why up front. */
export function PermissionGate({ permission, children }: PermissionGateProps) {
  const { can } = usePermissions()

  if (can(permission)) {
    return children
  }

  return (
    <PageShell>
      <SectionCard className="flex min-h-[calc(100vh-170px)] flex-col items-center justify-center text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Restricted</p>
        <h2 className="mt-3 text-base font-semibold text-slate-950">You don’t have access to this screen</h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Ask an administrator to grant your role this permission.
        </p>
        <PermissionChip permission={permission} className="mt-4" />
      </SectionCard>
    </PageShell>
  )
}
