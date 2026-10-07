import { useEffect, useState } from 'react'
import { Input } from '../../../shared/forms/Input'
import { Textarea } from '../../../shared/forms/Textarea'
import type { PlanStatus, SubscriptionPlan } from '../types/subscriptionManagement.types'
import { PlanStatusSelector } from './PlanStatusSelector'
import { SaveChangesButton } from './SaveChangesButton'

type PlanEditorFormProps = {
  plan: SubscriptionPlan
  onSave: (plan: SubscriptionPlan) => void
}

type PlanFormState = {
  price: string
  note: string
  rolloutNote: string
  status: PlanStatus
}

export function PlanEditorForm({ plan, onSave }: PlanEditorFormProps) {
  const [formState, setFormState] = useState<PlanFormState>({
    price: plan.price,
    note: plan.note,
    rolloutNote: plan.rolloutNote,
    status: plan.status,
  })

  useEffect(() => {
    setFormState({
      price: plan.price,
      note: plan.note,
      rolloutNote: plan.rolloutNote,
      status: plan.status,
    })
  }, [plan])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({
      ...plan,
      price: formState.price,
      note: formState.note,
      rolloutNote: formState.rolloutNote,
      status: formState.status,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-full rounded-[22px] border border-slate-300 bg-slate-50 p-5">
      <h3 className="font-semibold text-slate-950">
        Editing {plan.name} | {plan.billingCycle}
      </h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input
          label="Membership price"
          value={formState.price}
          onChange={(event) => setFormState((current) => ({ ...current, price: event.target.value }))}
          className="h-12 rounded-[22px] font-semibold"
        />
        <Input
          label="Promo label"
          value={formState.note}
          onChange={(event) => setFormState((current) => ({ ...current, note: event.target.value }))}
          className="h-12 rounded-[22px] font-semibold"
        />
      </div>
      <div className="mt-5">
        <Textarea
          label="Rollout note"
          value={formState.rolloutNote}
          onChange={(event) => setFormState((current) => ({ ...current, rolloutNote: event.target.value }))}
          className="min-h-24 rounded-[22px] font-semibold"
        />
      </div>
      <div className="mt-5">
        <PlanStatusSelector
          value={formState.status}
          onChange={(status) => setFormState((current) => ({ ...current, status }))}
        />
      </div>
      <SaveChangesButton className="mt-5" />
    </form>
  )
}
