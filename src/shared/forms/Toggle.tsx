import { cn } from '../utils/cn'

type ToggleProps = {
  checked: boolean
  label: string
}

export function Toggle({ checked, label }: ToggleProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
        checked ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600',
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  )
}
