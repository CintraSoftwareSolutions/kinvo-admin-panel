import type { FormEvent } from 'react'
import { useState } from 'react'
import { useActionGate } from '../../auth/hooks/usePermissions'
import { InlineError } from '../../../shared/components/InlineError'
import { Input } from '../../../shared/forms/Input'
import { Textarea } from '../../../shared/forms/Textarea'
import { humanize } from '../../../shared/utils/humanize'
import { useUpdatePlan } from '../hooks/useSubscriptionPlans'
import type { PlanPatch, RolloutState, SubscriptionPlan } from '../types/subscriptionManagement.types'
import { PlanStatusSelector } from './PlanStatusSelector'
import { PricePanel } from './PricePanel'
import { SaveChangesButton } from './SaveChangesButton'

type PlanEditorFormProps = {
  plan: SubscriptionPlan
}

/** Remount per plan (key={plan.id}) so the form starts from that plan's values. */
export function PlanEditorForm({ plan }: PlanEditorFormProps) {
  const [name, setName] = useState(plan.name)
  const [rolloutState, setRolloutState] = useState<RolloutState>(plan.rollout_state)
  const [rolloutNote, setRolloutNote] = useState(plan.rollout_note ?? '')
  const [isActive, setIsActive] = useState(plan.is_active)
  const [sortOrder, setSortOrder] = useState(String(plan.sort_order))
  const update = useUpdatePlan()
  const gate = useActionGate()('subscriptions.write')

  const sortOrderValid = /^-?\d+$/.test(sortOrder.trim())
  const patch: PlanPatch = {
    ...(name.trim() !== plan.name ? { name: name.trim() } : {}),
    ...(rolloutState !== plan.rollout_state ? { rollout_state: rolloutState } : {}),
    ...(rolloutNote.trim() !== (plan.rollout_note ?? '') ? { rollout_note: rolloutNote.trim() || null } : {}),
    ...(isActive !== plan.is_active ? { is_active: isActive } : {}),
    ...(sortOrderValid && Number(sortOrder) !== plan.sort_order ? { sort_order: Number(sortOrder) } : {}),
  }
  const hasChanges = Object.keys(patch).length > 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!hasChanges || !name.trim() || !sortOrderValid) return
    update.mutate({ id: plan.id, patch })
  }

  return (
    <div className="grid min-h-full content-start gap-4 rounded-[22px] border border-slate-300 bg-slate-50 p-5">
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div>
          <h3 className="font-semibold text-slate-950">Editing {plan.name}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Tier <span className="font-semibold">{plan.tier}</span> · billed{' '}
            <span className="font-semibold">{humanize(plan.billing_cycle)}</span> — fixed by design, not editable here.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px]">
          <Input label="Product name" value={name} onChange={(event) => setName(event.target.value)} className="h-12 rounded-[22px] font-semibold" />
          <Input
            label="Sort order"
            inputMode="numeric"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="h-12 rounded-[22px] font-semibold"
          />
        </div>
        <Textarea
          label="Rollout note"
          value={rolloutNote}
          onChange={(event) => setRolloutNote(event.target.value)}
          className="min-h-24 rounded-[22px] font-semibold"
        />
        <PlanStatusSelector value={rolloutState} onChange={setRolloutState} />
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
          />
          <span>
            <span className="block text-sm font-semibold text-slate-950">Visible in the app</span>
            <span className="block text-xs text-slate-500">Controls whether the mobile app offers this product. Separate from rollout state.</span>
          </span>
        </label>
        <InlineError error={update.error} />
        {update.isSuccess && !hasChanges ? <p className="text-sm font-medium text-emerald-700">Saved.</p> : null}
        <div>
          <SaveChangesButton disabled={!gate.allowed || !hasChanges || !name.trim() || !sortOrderValid || update.isPending} title={gate.reason}>
            {update.isPending ? 'Saving…' : 'Save changes'}
          </SaveChangesButton>
        </div>
      </form>
      <PricePanel plan={plan} />
    </div>
  )
}
