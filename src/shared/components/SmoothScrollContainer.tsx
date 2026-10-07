import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

type SmoothScrollContainerProps = {
  children: ReactNode
  className?: string
}

export function SmoothScrollContainer({ children, className }: SmoothScrollContainerProps) {
  return (
    <main className={cn('min-h-screen min-w-0 max-w-full overflow-x-hidden overflow-y-auto scroll-smooth bg-white', className)}>
      {children}
    </main>
  )
}
