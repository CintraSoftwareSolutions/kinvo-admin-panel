import { cn } from '../utils/cn'

type ToggleProps = {
  checked: boolean
  label: string
  onChange?: (checked: boolean) => void
  disabled?: boolean
  title?: string
}

export function Toggle({ checked, label, onChange, disabled, title }: ToggleProps) {
  const className = cn(
    'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
    checked ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600',
  )

  if (!onChange) {
    return (
      <span className={className} title={title}>
        <span className="h-2 w-2 rounded-full bg-current" />
        {label}
      </span>
    )
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      title={title}
      onClick={() => onChange(!checked)}
      className={cn(className, 'transition enabled:hover:ring-2 enabled:hover:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60')}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </button>
  )
}
