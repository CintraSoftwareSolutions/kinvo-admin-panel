import { useActionGate, usePermissions } from '../../../auth/hooks/usePermissions'
import { readOnlyGuardrailKey, useGuardrails, useToggleGuardrail } from '../../../auth/hooks/useGuardrails'
import { ErrorState } from '../../../../shared/components/ErrorState'
import { InlineError } from '../../../../shared/components/InlineError'
import { Skeleton } from '../../../../shared/components/Skeleton'
import { Toggle } from '../../../../shared/forms/Toggle'
import { appIcons } from '../../../../shared/icons/appIcons'
import { formatDateTime } from '../../../../shared/utils/formatDate'

const GuardrailsIcon = appIcons.userManagement.guardrails
const TrustIcon = appIcons.userManagement.guardrailCards.trust

export function GuardrailsPanel() {
  const guardrails = useGuardrails()
  const toggle = useToggleGuardrail()
  const { can } = usePermissions()
  const gate = useActionGate()

  return (
    <div className="rounded-[24px] border border-slate-300 bg-slate-50 p-4">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-semibold text-slate-950">Guardrails & approvals</h3>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <GuardrailsIcon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <InlineError error={toggle.error} className="mb-3" />
      {guardrails.isPending ? (
        <Skeleton className="h-32" />
      ) : guardrails.error ? (
        <ErrorState error={guardrails.error} onRetry={() => void guardrails.refetch()} />
      ) : (
        <div className="grid gap-3 xl:grid-cols-3">
          {guardrails.data.map((guardrail) => {
            // Read-only mode must stay switchable while it is on, or nobody could turn it off.
            const allowed =
              guardrail.key === readOnlyGuardrailKey ? can('roles.write') : gate('roles.write').allowed
            return (
              <div key={guardrail.key} className="rounded-[18px] border border-slate-300 bg-white p-4">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <TrustIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <Toggle
                    checked={guardrail.enabled}
                    label={guardrail.enabled ? 'On' : 'Off'}
                    disabled={!allowed || toggle.isPending}
                    title={allowed ? undefined : 'Requires roles.write'}
                    onChange={(enabled) => toggle.mutate({ key: guardrail.key, enabled })}
                  />
                </div>
                <p className="text-sm font-semibold text-slate-950">{guardrail.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{guardrail.description}</p>
                <p className="mt-2 text-[11px] text-slate-400">Updated {formatDateTime(guardrail.updated_at)}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
