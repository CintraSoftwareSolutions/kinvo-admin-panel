import { BarChartCard } from '../../../../shared/charts/BarChartCard'
import type { ChurnPoint } from '../../types/analyticsDashboard.types'

type PlanChurnChartProps = {
  data: ChurnPoint[]
}

export function PlanChurnChart({ data }: PlanChurnChartProps) {
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
        { key: 'primary', label: 'Primary churn', className: 'bg-rose-400' },
        { key: 'secondary', label: 'Secondary churn', className: 'bg-blue-500' },
      ]}
      maxValue={12}
      ticks={[12, 9, 6, 3, 0]}
    />
  )
}
