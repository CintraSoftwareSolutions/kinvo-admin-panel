import { Toggle } from '../../../../shared/forms/Toggle'
import { appIcons } from '../../../../shared/icons/appIcons'
import { guardrailsMock } from '../../data/roles.mock'

const guardrailIcons = [
  appIcons.userManagement.guardrailCards.checklist,
  appIcons.userManagement.guardrailCards.history,
  appIcons.userManagement.guardrailCards.trust,
]
const GuardrailsIcon = appIcons.userManagement.guardrails

export function GuardrailsPanel() {
  return (
    <div className="rounded-[24px] border border-slate-300 bg-slate-50 p-4">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-semibold text-slate-950">Guardrails & approvals</h3>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <GuardrailsIcon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div className="grid gap-3 xl:grid-cols-3">
        {guardrailsMock.map((guardrail, index) => {
          const Icon = guardrailIcons[index] ?? GuardrailsIcon
          return (
            <div key={guardrail.id} className="rounded-[18px] border border-slate-300 bg-white p-4">
              <div className="mb-4 flex items-start justify-between gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <Toggle checked={guardrail.enabled} label={guardrail.enabled ? 'On' : 'Off'} />
              </div>
              <p className="text-sm font-semibold text-slate-950">{guardrail.title}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
