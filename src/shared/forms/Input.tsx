import type { InputHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label ? <span>{label}</span> : null}
      <input
        className={cn(
          'h-11 rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100',
          className,
        )}
        {...props}
      />
    </label>
  )
}
