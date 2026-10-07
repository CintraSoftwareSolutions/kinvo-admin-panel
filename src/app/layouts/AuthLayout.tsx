import type { ReactNode } from 'react'
import { AuthBackground } from '../../features/auth/components/AuthBackground'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <AuthBackground>{children}</AuthBackground>
    </main>
  )
}
