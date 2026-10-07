import type { ReactNode } from 'react'
import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { MobileSidebar } from './components/MobileSidebar'
import { Topbar } from './components/Topbar'
import { ReadOnlyBanner } from './components/ReadOnlyBanner'
import { SmoothScrollContainer } from '../../shared/components/SmoothScrollContainer'
import type { RoutePath } from '../router/routePaths'

type AdminLayoutProps = {
  children: ReactNode
  currentPath: string
  title: string
  searchQuery: string
  onSearchChange: (value: string) => void
  onNavigate: (path: RoutePath) => void
  searchPlaceholder: string
  titleBadge?: string
}

export function AdminLayout({
  children,
  currentPath,
  title,
  searchQuery,
  onSearchChange,
  onNavigate,
  searchPlaceholder,
  titleBadge,
}: AdminLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-950">
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        currentPath={currentPath}
        onNavigate={onNavigate}
      />
      <div className="min-h-screen min-w-0 max-w-full lg:pl-[276px]">
        <Topbar
          title={title}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onMenuClick={() => setMobileSidebarOpen(true)}
          searchPlaceholder={searchPlaceholder}
          titleBadge={titleBadge}
        />
        <ReadOnlyBanner />
        <SmoothScrollContainer>{children}</SmoothScrollContainer>
      </div>
    </div>
  )
}
