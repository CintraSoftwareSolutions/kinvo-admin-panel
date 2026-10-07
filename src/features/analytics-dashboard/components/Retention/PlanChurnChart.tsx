import { BarChartCard } from '../../../../shared/charts/BarChartCard'
import { chartScale } from '../../../../shared/utils/chartScale'
import type { ChurnPoint } from '../../types/analyticsDashboard.types'

type PlanChurnChartProps = {
  data: ChurnPoint[]
}

export function PlanChurnChart({ data }: PlanChurnChartProps) {
  const { maxValue, ticks } = chartScale(data.flatMap((item) => [item.primary, item.secondary]))

  return (
    <BarChartCard
      data={data.map((item) => ({
        label: item.month,
        values: {
          primary: item.primary,
          secondary: item.secondary,
        },
      }))}
      series={[
        { key: 'primary', label: 'Monthly plans', className: 'bg-rose-400' },
        { key: 'secondary', label: 'Yearly plans', className: 'bg-blue-500' },
      ]}
      maxValue={maxValue}
      ticks={ticks}
    />
  )
}
