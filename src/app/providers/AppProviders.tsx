import type { ReactNode } from 'react'
import { MotionProvider } from './MotionProvider'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return <MotionProvider>{children}</MotionProvider>
}
