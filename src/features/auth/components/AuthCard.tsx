import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '../../../shared/utils/cn'

type AuthCardProps = {
  children: ReactNode
  className?: string
}

type AuthPrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        'w-full rounded-[28px] border border-white/55 bg-white p-5 shadow-[0_24px_70px_rgba(16,24,40,0.22)] sm:p-7',
        className,
      )}
    >
      {children}
    </motion.section>
  )
}

export function AuthPrimaryButton({ className, children, ...props }: AuthPrimaryButtonProps) {
  return (
    <button
      type="submit"
      className={cn(
        'inline-flex h-11 w-full items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(111,61,204,0.24)] transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100 disabled:bg-violet-300',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
