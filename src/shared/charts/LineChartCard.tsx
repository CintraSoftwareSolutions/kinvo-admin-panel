import { ChartTooltip } from './ChartTooltip'
import { cn } from '../utils/cn'

export type LineChartSeries = {
  key: string
  label: string
  stroke: string
  fill: string
  dotClassName: string
}

export type LineChartDatum = {
  label: string
  values: Record<string, number>
}

type LineChartCardProps = {
  data: LineChartDatum[]
  series: LineChartSeries[]
  maxValue: number
  ticks: number[]
}

const width = 700
const height = 190
const paddingX = 12
const paddingY = 10

function getX(index: number, count: number) {
  if (count <= 1) {
    return paddingX
  }

  return paddingX + (index / (count - 1)) * (width - paddingX * 2)
}

function getY(value: number, maxValue: number) {
  return paddingY + (1 - value / maxValue) * (height - paddingY * 2)
}

function linePath(data: LineChartDatum[], key: string, maxValue: number) {
  return data
    .map((item, index) => `${index === 0 ? 'M' : 'L'} ${getX(index, data.length)} ${getY(item.values[key], maxValue)}`)
    .join(' ')
}

function areaPath(data: LineChartDatum[], key: string, maxValue: number) {
  const baseline = height - paddingY
  return `${linePath(data, key, maxValue)} L ${getX(data.length - 1, data.length)} ${baseline} L ${getX(0, data.length)} ${baseline} Z`
}

export function LineChartCard({ data, series, maxValue, ticks }: LineChartCardProps) {
  return (
    <div className="mt-6 w-full min-w-0 max-w-full">
      <div className="grid min-w-0 grid-cols-[32px_minmax(0,1fr)] gap-2 sm:grid-cols-[40px_minmax(0,1fr)] sm:gap-3">
        {/* Each label sits centred on its gridline: first at the top edge, last on the baseline. */}
        <div className="relative h-40 text-xs text-slate-500 sm:h-48">
          {ticks.map((tick, index) => (
            <span
              key={tick}
              className="absolute left-0 -translate-y-1/2 leading-none"
              style={{ top: `${(index / Math.max(ticks.length - 1, 1)) * 100}%` }}
            >
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
          <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            {series.map((entry) => (
              <path key={`${entry.key}-area`} d={areaPath(data, entry.key, maxValue)} fill={entry.fill} />
            ))}
            {series.map((entry) => (
              <path
                key={`${entry.key}-line`}
                d={linePath(data, entry.key, maxValue)}
                fill="none"
                stroke={entry.stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          <div className="absolute inset-0 grid min-w-0 px-2 sm:px-3" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
            {data.map((item) => (
              <span key={item.label} className="group relative h-full" tabIndex={0}>
                <ChartTooltip
                  title={item.label}
                  items={series.map((entry) => ({
                    label: entry.label,
                    value: item.values[entry.key],
                  }))}
                />
                {series.map((entry) => (
                  <span
                    key={entry.key}
                    className={cn(
                      'absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white opacity-0 shadow-sm transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100',
                      entry.dotClassName,
                    )}
                    style={{ top: `${(getY(item.values[entry.key], maxValue) / height) * 100}%` }}
                  />
                ))}
              </span>
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
