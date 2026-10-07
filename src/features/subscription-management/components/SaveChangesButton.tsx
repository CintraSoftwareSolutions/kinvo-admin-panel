import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../../shared/utils/cn'

type SaveChangesButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function SaveChangesButton({ className, children = 'Save changes', ...props }: SaveChangesButtonProps) {
  return (
    <button
      type="submit"
      className={cn(
        'h-10 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(111,61,204,0.22)] transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300 disabled:shadow-none',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
