import type { ReactNode } from 'react'
import { Modal } from '../../../../shared/components/Modal'

export type QuickActionDetail = {
  label: string
  value: ReactNode
}

export type QuickActionOption<TValue extends string> = {
  value: TValue
  label: string
  description?: string
}

type UserQuickActionModalProps<TValue extends string> = {
  open: boolean
  title: string
  description?: string
  details?: QuickActionDetail[]
  options?: Array<QuickActionOption<TValue>>
  value?: TValue
  saveLabel?: string
  onValueChange?: (value: TValue) => void
  onSave?: () => void
  onClose: () => void
}

export function UserQuickActionModal<TValue extends string>({
  open,
  title,
  description,
  details,
  options,
  value,
  saveLabel = 'Save',
  onValueChange,
  onSave,
  onClose,
}: UserQuickActionModalProps<TValue>) {
  const hasOptions = options && options.length > 0

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="grid gap-4">
        {description ? <p className="text-sm leading-6 text-slate-600">{description}</p> : null}
        {details && details.length > 0 ? (
          <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-start justify-between gap-4 text-sm">
                <span className="font-semibold text-slate-500">{detail.label}</span>
                <span className="text-right font-semibold text-slate-950">{detail.value}</span>
              </div>
            ))}
          </div>
        ) : null}
        {hasOptions ? (
          <div className="grid gap-2">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-violet-300 hover:bg-violet-50/40"
              >
                <input
                  type="radio"
                  checked={value === option.value}
                  onChange={() => onValueChange?.(option.value)}
                  className="mt-1 h-4 w-4 border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-950">{option.label}</span>
                  {option.description ? <span className="mt-1 block text-xs text-slate-500">{option.description}</span> : null}
                </span>
              </label>
            ))}
          </div>
        ) : null}
        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700"
          >
            {hasOptions ? 'Cancel' : 'Close'}
          </button>
          {hasOptions ? (
            <button
              type="button"
              onClick={onSave}
              className="h-11 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(111,61,204,0.26)] transition hover:bg-violet-700"
            >
              {saveLabel}
            </button>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}
