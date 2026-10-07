import { LineChartCard } from '../../../../shared/charts/LineChartCard'
import type { EngagementPoint } from '../../types/analyticsDashboard.types'

type ActiveVsVerifiedChartProps = {
  data: EngagementPoint[]
}

export function ActiveVsVerifiedChart({ data }: ActiveVsVerifiedChartProps) {
  return (
    <LineChartCard
      data={data.map((item) => ({
        label: item.month,
        values: {
          activeUsers: item.activeUsers,
          verifiedUsers: item.verifiedUsers,
        },
      }))}
      series={[
        {
          key: 'activeUsers',
          label: 'Active users',
          stroke: '#6f3dcc',
          fill: 'rgba(111,61,204,0.12)',
          dotClassName: 'bg-violet-600',
        },
        {
          key: 'verifiedUsers',
          label: 'Verified users',
          stroke: '#3b82f6',
          fill: 'rgba(59,130,246,0.10)',
          dotClassName: 'bg-blue-500',
        },
      ]}
      maxValue={8000}
      ticks={[8000, 6000, 4000, 2000, 0]}
    />
  )
}
