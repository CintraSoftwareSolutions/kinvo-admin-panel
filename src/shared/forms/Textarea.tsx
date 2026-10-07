import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label ? <span>{label}</span> : null}
      <textarea
        className={cn(
          'min-h-24 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100',
          className,
        )}
        {...props}
      />
    </label>
  )
}
