import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

type IconButtonGroupProps = {
  children: ReactNode
  className?: string
}

export function IconButtonGroup({ children, className }: IconButtonGroupProps) {
  return <div className={cn('flex items-center gap-2', className)}>{children}</div>
}
