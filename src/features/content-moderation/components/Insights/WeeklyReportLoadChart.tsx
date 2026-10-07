import { BarChartCard } from '../../../../shared/charts/BarChartCard'
import { formatDate } from '../../../../shared/utils/formatDate'
import { chartScale } from '../../../../shared/utils/chartScale'
import type { WeeklyReportLoad } from '../../types/contentModeration.types'

const series = [
  { key: 'reports', label: 'Reported', className: 'bg-orange-400' },
  { key: 'resolved', label: 'Resolved', className: 'bg-emerald-500' },
]

/** Twelve weeks; each label is the week's start date. */
export function WeeklyReportLoadChart({ weeks }: { weeks: WeeklyReportLoad[] }) {
  const { maxValue, ticks } = chartScale(weeks.flatMap((week) => [week.reports, week.resolved]))
  const data = weeks.map((week) => ({
    label: formatDate(week.week).slice(0, 6),
    values: { reports: week.reports, resolved: week.resolved },
  }))

  return <BarChartCard data={data} series={series} maxValue={maxValue} ticks={ticks} />
}
