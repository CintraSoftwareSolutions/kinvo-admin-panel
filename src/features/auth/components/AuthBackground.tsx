import type { ReactNode } from 'react'

type AuthBackgroundProps = {
  children: ReactNode
}

export function AuthBackground({ children }: AuthBackgroundProps) {
  return (
    <div className="relative flex min-h-screen w-full min-w-0 items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#24184d_0%,#3d1f78_48%,#6940c6_100%)] px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(217,204,255,0.18),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_46%)]" />
      <div className="relative z-10 w-full max-w-[420px] min-w-0">{children}</div>
    </div>
  )
}
