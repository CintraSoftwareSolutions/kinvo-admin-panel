import type { AppIcon } from '../icons/appIcons'
import { cn } from '../utils/cn'

export type PillTabItem<TValue extends string> = {
  value: TValue
  label: string
  icon?: AppIcon
  count?: number
}

type PillTabsProps<TValue extends string> = {
  tabs: Array<PillTabItem<TValue>>
  activeTab: TValue
  onChange: (value: TValue) => void
  variant?: 'filled' | 'underline'
  className?: string
}

export function PillTabs<TValue extends string>({
  tabs,
  activeTab,
  onChange,
  variant = 'filled',
  className,
}: PillTabsProps<TValue>) {
  return (
    <div
      className={cn('flex min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', className)}
      role="tablist"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = tab.value === activeTab
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              'inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap px-4 text-sm font-semibold transition',
              variant === 'filled' &&
                'rounded-full border border-slate-300 text-slate-600 hover:border-violet-300 hover:text-violet-700',
              variant === 'filled' &&
                active &&
                'border-violet-600 bg-violet-600 text-white shadow-[0_14px_34px_rgba(111,61,204,0.26)]',
              variant === 'underline' && 'rounded-none border-b-2 border-transparent px-0 text-slate-400',
              variant === 'underline' && active && 'border-violet-600 text-violet-700',
            )}
          >
            {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
            <span>{tab.label}</span>
            {tab.count !== undefined ? (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[11px]',
                  active ? 'bg-white/20 text-white' : 'bg-violet-100 text-violet-700',
                )}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
