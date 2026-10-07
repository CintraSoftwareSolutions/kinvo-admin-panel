import type { InputHTMLAttributes } from 'react'
import { useId, useState } from 'react'
import { FormError } from '../../../shared/forms/FormError'
import { appIcons } from '../../../shared/icons/appIcons'
import { cn } from '../../../shared/utils/cn'

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  error?: string
}

const ShowPasswordIcon = appIcons.auth.showPassword
const HidePasswordIcon = appIcons.auth.hidePassword

export function PasswordField({ label, error, id, className, ...props }: PasswordFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [visible, setVisible] = useState(false)
  const ToggleIcon = visible ? HidePasswordIcon : ShowPasswordIcon

  return (
    <div className="grid gap-2">
      <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          className={cn(
            'h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-100',
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          title={visible ? 'Hide password' : 'Show password'}
          className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
          onClick={() => setVisible((value) => !value)}
        >
          <ToggleIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <FormError message={error} />
    </div>
  )
}
