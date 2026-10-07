import type { SelectHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
}

export function Select({ label, className, children, ...props }: SelectProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label ? <span>{label}</span> : null}
      <select
        className={cn(
          'h-11 rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
