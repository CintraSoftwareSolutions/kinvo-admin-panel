import { BarChartCard } from '../../../../shared/charts/BarChartCard'
import { chartScale } from '../../../../shared/utils/chartScale'
import type { WeeklyResolutionPoint } from '../../types/analyticsDashboard.types'

type WeeklyResolutionChartProps = {
  data: WeeklyResolutionPoint[]
}

export function WeeklyResolutionChart({ data }: WeeklyResolutionChartProps) {
  const { maxValue, ticks } = chartScale(data.flatMap((item) => [item.reported, item.resolved]))

  return (
    <BarChartCard
      data={data.map((item) => ({
        label: item.week,
        values: {
          reported: item.reported,
          resolved: item.resolved,
        },
      }))}
      series={[
        { key: 'reported', label: 'Reported', className: 'bg-orange-400' },
        { key: 'resolved', label: 'Resolved', className: 'bg-emerald-500' },
      ]}
      maxValue={maxValue}
      ticks={ticks}
    />
  )
}
