import type { FormEvent } from 'react'
import { useState } from 'react'
import { useActionGate } from '../../auth/hooks/usePermissions'
import { ErrorState } from '../../../shared/components/ErrorState'
import { InlineError } from '../../../shared/components/InlineError'
import { Skeleton } from '../../../shared/components/Skeleton'
import { FormError } from '../../../shared/forms/FormError'
import { Input } from '../../../shared/forms/Input'
import { formatMinor, parseMajorToMinor } from '../../../shared/utils/formatCurrency'
import { formatDate } from '../../../shared/utils/formatDate'
import { useCreatePriceVersion, usePriceHistory } from '../hooks/useSubscriptionPlans'
import type { SubscriptionPlan } from '../types/subscriptionManagement.types'
import { SaveChangesButton } from './SaveChangesButton'

/** A price is never edited: each change is a new version, and the history is kept. */
export function PricePanel({ plan }: { plan: SubscriptionPlan }) {
  const history = usePriceHistory(plan.id)
  const createVersion = useCreatePriceVersion()
  const gate = useActionGate()('subscriptions.write')
  const currency = plan.price?.currency ?? plan.currency
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [amountError, setAmountError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const amountMinor = parseMajorToMinor(amount, currency)
    if (amountMinor === null) {
      setAmountError(`Enter an amount in ${currency}, e.g. 19.99`)
      return
    }
    createVersion.mutate(
      { id: plan.id, amountMinor, currency, note: note.trim() },
      {
        onSuccess: () => {
          setAmount('')
          setNote('')
          void history.refetch()
        },
      },
    )
  }

  return (
    <div className="grid gap-4 rounded-[22px] border border-slate-300 bg-white p-4">
      <div>
        <h4 className="font-semibold text-slate-950">Price</h4>
        <p className="mt-1 text-xs text-slate-500">
          Current: {plan.price ? `${formatMinor(plan.price.amount_minor, plan.price.currency)} since ${formatDate(plan.price.effective_from)}` : 'none'}.
          A change creates a new version; existing versions are never edited.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[160px_minmax(0,1fr)_auto] sm:items-end">
        <div className="grid gap-2">
          <Input
            label={`New price (${currency})`}
            inputMode="decimal"
            placeholder="19.99"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value)
              setAmountError('')
            }}
          />
        </div>
        <Input label="Note (optional)" value={note} placeholder="Why the price is changing" onChange={(event) => setNote(event.target.value)} />
        <SaveChangesButton className="h-11" disabled={!gate.allowed || !amount.trim() || createVersion.isPending} title={gate.reason}>
          {createVersion.isPending ? 'Adding…' : 'Add version'}
        </SaveChangesButton>
      </form>
      <FormError message={amountError} />
      <InlineError error={createVersion.error} />

      <div className="grid gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Version history</p>
        {history.isPending ? (
          <Skeleton className="h-16" />
        ) : history.error ? (
          <ErrorState error={history.error} onRetry={() => void history.refetch()} />
        ) : (
          history.data.map((version) => (
            <div key={version.id} className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">{formatMinor(version.amount_minor, version.currency)}</p>
                {version.note ? <p className="mt-1 text-xs text-slate-500">{version.note}</p> : null}
              </div>
              <p className="text-xs text-slate-500">
                {formatDate(version.effective_from)} → {version.effective_to ? formatDate(version.effective_to) : 'open'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
