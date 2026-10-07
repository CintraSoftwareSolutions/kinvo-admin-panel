import { LineChartCard } from '../../../../shared/charts/LineChartCard'
import { chartScale } from '../../../../shared/utils/chartScale'
import type { EngagementPoint } from '../../types/analyticsDashboard.types'

type ActiveVsVerifiedChartProps = {
  data: EngagementPoint[]
}

/** activeUsers is the account base at each month end, not MAU — labelled accordingly. */
export function ActiveVsVerifiedChart({ data }: ActiveVsVerifiedChartProps) {
  const { maxValue, ticks } = chartScale(data.flatMap((item) => [item.activeUsers, item.verifiedUsers]))

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
          label: 'Accounts at month end',
          stroke: '#6f3dcc',
          fill: 'rgba(111,61,204,0.12)',
          dotClassName: 'bg-violet-600',
        },
        {
          key: 'verifiedUsers',
          label: 'Verified accounts',
          stroke: '#3b82f6',
          fill: 'rgba(59,130,246,0.10)',
          dotClassName: 'bg-blue-500',
        },
      ]}
      maxValue={maxValue}
      ticks={ticks}
    />
  )
}
