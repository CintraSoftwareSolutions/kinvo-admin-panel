import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

type ResponsiveGridProps = {
  children: ReactNode
  className?: string
}

export function ResponsiveGrid({ children, className }: ResponsiveGridProps) {
  return <div className={cn('grid min-w-0 max-w-full gap-3 sm:grid-cols-2 xl:grid-cols-4', className)}>{children}</div>
}
