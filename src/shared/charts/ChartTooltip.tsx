import { cn } from '../utils/cn'

type ChartTooltipItem = {
  label: string
  value: string | number
}

type ChartTooltipProps = {
  title: string
  items: ChartTooltipItem[]
  className?: string
}

export function ChartTooltip({ title, items, className }: ChartTooltipProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 min-w-36 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-xs opacity-0 shadow-xl shadow-slate-950/10 transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100',
        className,
      )}
      role="tooltip"
    >
      <p className="font-semibold text-slate-950">{title}</p>
      <div className="mt-1 grid gap-1 text-slate-600">
        {items.map((item) => (
          <p key={item.label} className="flex items-center justify-between gap-4">
            <span>{item.label}</span>
            <span className="font-semibold text-slate-900">{item.value}</span>
          </p>
        ))}
      </div>
    </div>
  )
}
