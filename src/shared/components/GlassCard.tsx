import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

type GlassCardProps = {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn('rounded-[22px] border border-white/15 bg-white/10 backdrop-blur', className)}>
      {children}
    </div>
  )
}
