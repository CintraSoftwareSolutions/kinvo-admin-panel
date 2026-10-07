import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '../utils/cn'

type SectionCardProps = {
  children: ReactNode
  className?: string
  padded?: boolean
}

export function SectionCard({ children, className, padded = true }: SectionCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'min-w-0 max-w-full overflow-x-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.05)]',
        padded && 'p-4 sm:p-6',
        className,
      )}
    >
      {children}
    </motion.section>
  )
}
