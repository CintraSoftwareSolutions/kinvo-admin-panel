import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

type PageShellProps = {
  children: ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn('mx-auto w-full min-w-0 max-w-[1720px] overflow-x-hidden px-3 py-3 sm:px-6 lg:px-7', className)}>
      {children}
    </div>
  )
}
