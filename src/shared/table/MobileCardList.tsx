import type { ReactNode } from 'react'

type MobileCardListProps = {
  children: ReactNode
}

export function MobileCardList({ children }: MobileCardListProps) {
  return <div className="grid max-w-full min-w-0 gap-3 lg:hidden">{children}</div>
}
