import type { AppIcon } from '../../../shared/icons/appIcons'
import { cn } from '../../../shared/utils/cn'

type SidebarItemProps = {
  label: string
  icon: AppIcon
  active?: boolean
  count?: number
  disabled?: boolean
  onClick?: () => void
}

export function SidebarItem({ label, icon: Icon, active, count, disabled, onClick }: SidebarItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'group flex min-h-16 w-full items-center gap-3 rounded-[20px] px-4 text-left text-sm font-semibold leading-tight transition',
        active ? 'bg-white text-slate-950 shadow-lg' : 'text-white/80 hover:bg-white/10 hover:text-white',
        disabled && 'cursor-default',
      )}
    >
      <span
        className={cn(
          'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl',
          active ? 'bg-violet-100 text-violet-700' : 'bg-white/10 text-white',
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">{label}</span>
      {count !== undefined ? (
        <span className={cn('rounded-full px-2 py-0.5 text-[11px]', active ? 'bg-violet-100 text-violet-700' : 'bg-white/18')}>
          {count}
        </span>
      ) : null}
    </button>
  )
}
