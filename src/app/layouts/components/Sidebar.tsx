import { navigationItems } from '../../../config/navigation'
import { AnimatedNumber } from '../../../shared/components/AnimatedNumber'
import { GlassCard } from '../../../shared/components/GlassCard'
import { appIcons } from '../../../shared/icons/appIcons'
import { cn } from '../../../shared/utils/cn'
import type { RoutePath } from '../../router/routePaths'
import { SidebarItem } from './SidebarItem'

type SidebarProps = {
  mobile?: boolean
  currentPath: string
  onNavigate: (path: RoutePath) => void
}

const ResponseSlaIcon = appIcons.sidebar.responseSla

export function Sidebar({ mobile, currentPath, onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        'inset-y-0 left-0 z-30 w-[276px] max-w-[calc(100vw-24px)] bg-[linear-gradient(180deg,#24184d_0%,#3d1f78_48%,#6940c6_100%)] px-4 py-7 text-white',
        mobile ? 'flex h-full flex-col' : 'fixed hidden lg:flex lg:flex-col',
      )}
    >
      <div className="mb-7 flex items-center gap-3 px-2">
        <img src="/logo/Kinvo.svg" alt="Kinvo" className="h-11 w-11 rounded-2xl" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">Kinvo</p>
          <p className="text-2xl font-semibold leading-none">Admin</p>
        </div>
      </div>
      <GlassCard className="mb-3 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/65">Workspace</p>
      </GlassCard>
      <nav className="grid gap-2">
        {navigationItems.map((item) => {
          const active = item.path === currentPath
          return (
            <SidebarItem
              key={item.path}
              label={item.label}
              icon={item.icon}
              active={active}
              count={item.count}
              disabled={item.disabled}
              onClick={() => onNavigate(item.path)}
            />
          )
        })}
      </nav>
      <div className="mt-auto">
        <GlassCard className="p-4">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
            <ResponseSlaIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60">Response SLA</p>
          <AnimatedNumber value={96} suffix="%" className="mt-3 block text-2xl font-semibold" />
        </GlassCard>
      </div>
    </aside>
  )
}
