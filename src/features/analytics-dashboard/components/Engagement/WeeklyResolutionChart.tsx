import { BarChartCard } from '../../../../shared/charts/BarChartCard'
import type { WeeklyResolutionPoint } from '../../types/analyticsDashboard.types'

type WeeklyResolutionChartProps = {
  data: WeeklyResolutionPoint[]
}

export function WeeklyResolutionChart({ data }: WeeklyResolutionChartProps) {
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
      maxValue={24}
      ticks={[24, 18, 12, 6, 0]}
    />
  )
}
