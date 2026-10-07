import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { AppIcon } from '../icons/appIcons'
import { cn } from '../utils/cn'

type ActionIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: AppIcon
  label: string
  active?: boolean
}

export const ActionIconButton = forwardRef<HTMLButtonElement, ActionIconButtonProps>(function ActionIconButton(
  { icon: Icon, label, active, className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:border-violet-300 hover:text-violet-700',
        active && 'border-violet-500 bg-violet-50 text-violet-700',
        className,
      )}
      {...props}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  )
})
