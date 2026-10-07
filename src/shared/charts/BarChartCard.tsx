import { ChartTooltip } from './ChartTooltip'
import { cn } from '../utils/cn'

export type BarChartSeries = {
  key: string
  label: string
  className: string
}

export type BarChartDatum = {
  label: string
  values: Record<string, number>
}

type BarChartCardProps = {
  data: BarChartDatum[]
  series: BarChartSeries[]
  maxValue: number
  ticks: number[]
  className?: string
}

export function BarChartCard({ data, series, maxValue, ticks, className }: BarChartCardProps) {
  return (
    <div className={cn('mt-6 w-full min-w-0 max-w-full', className)}>
      <div className="grid min-w-0 grid-cols-[32px_minmax(0,1fr)] gap-2 sm:grid-cols-[40px_minmax(0,1fr)] sm:gap-3">
        <div className="grid h-40 text-xs text-slate-500 sm:h-48" style={{ gridTemplateRows: `repeat(${ticks.length}, minmax(0, 1fr))` }}>
          {ticks.map((tick) => (
            <span key={tick} className="leading-none">
              {tick}
            </span>
          ))}
        </div>
        <div className="relative h-40 min-w-0 border-b border-dashed border-slate-200 sm:h-48">
          <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${ticks.length - 1}, minmax(0, 1fr))` }}>
            {Array.from({ length: ticks.length - 1 }).map((_, index) => (
              <span key={index} className="border-t border-dashed border-slate-200" />
            ))}
          </div>
          <div
            className="relative z-10 grid h-full min-w-0 items-end gap-3 px-2 sm:gap-6 sm:px-3"
            style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
          >
            {data.map((item) => (
              <div key={item.label} className="flex h-full min-w-0 items-end justify-center gap-1.5 sm:gap-2">
                {series.map((entry) => (
                  <span key={entry.key} className="group relative flex h-full w-full min-w-0 max-w-[70px] items-end" tabIndex={0}>
                    <ChartTooltip
                      title={item.label}
                      items={series.map((tooltipEntry) => ({
                        label: tooltipEntry.label,
                        value: item.values[tooltipEntry.key],
                      }))}
                    />
                    <span
                      className={cn(
                        'w-full rounded-t-xl transition duration-200 group-hover:-translate-y-0.5 group-hover:brightness-105 group-hover:saturate-110 group-focus-within:-translate-y-0.5 group-focus-within:brightness-105 group-focus-within:saturate-110',
                        entry.className,
                      )}
                      style={{ height: `${(item.values[entry.key] / maxValue) * 100}%` }}
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="ml-10 mt-2 grid min-w-0 gap-3 px-2 text-center text-xs text-slate-500 sm:ml-[52px] sm:gap-6 sm:px-3"
        style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
      >
        {data.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </div>
  )
}
