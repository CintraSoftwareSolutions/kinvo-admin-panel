import { ChartTooltip } from '../../../../shared/charts/ChartTooltip'
import { weeklyReportLoadMock } from '../../data/moderationInsights.mock'

const maxValue = 24

export function WeeklyReportLoadChart() {
  return (
    <div className="mt-6 w-full min-w-0 max-w-full">
      <div className="grid min-w-0 grid-cols-[32px_minmax(0,1fr)] gap-2 sm:grid-cols-[40px_minmax(0,1fr)] sm:gap-3">
        <div className="grid h-48 grid-rows-5 text-xs text-slate-500">
          {[24, 18, 12, 6, 0].map((tick) => (
            <span key={tick} className="leading-none">
              {tick}
            </span>
          ))}
        </div>
        <div className="relative h-48 min-w-0 border-b border-dashed border-slate-200">
          <div className="absolute inset-0 grid grid-rows-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={index} className="border-t border-dashed border-slate-200" />
            ))}
          </div>
          <div className="relative z-10 grid h-full min-w-0 grid-cols-4 items-end gap-3 px-2 sm:gap-6 sm:px-3">
            {weeklyReportLoadMock.map((item) => (
              <div key={item.week} className="flex h-full min-w-0 items-end justify-center gap-1.5 sm:gap-2">
                <span className="group relative flex h-full w-full min-w-0 max-w-[70px] items-end" tabIndex={0}>
                  <ChartTooltip
                    title={item.week}
                    items={[
                      { label: 'Reported', value: item.reports },
                      { label: 'Resolved', value: item.resolved },
                    ]}
                  />
                  <span
                    className="w-full rounded-t-xl bg-orange-400 transition duration-200 group-hover:brightness-105 group-hover:saturate-110 group-focus-within:brightness-105 group-focus-within:saturate-110"
                    style={{ height: `${(item.reports / maxValue) * 100}%` }}
                  />
                </span>
                <span className="group relative flex h-full w-full min-w-0 max-w-[70px] items-end" tabIndex={0}>
                  <ChartTooltip
                    title={item.week}
                    items={[
                      { label: 'Reported', value: item.reports },
                      { label: 'Resolved', value: item.resolved },
                    ]}
                  />
                  <span
                    className="w-full rounded-t-xl bg-emerald-500 transition duration-200 group-hover:brightness-105 group-hover:saturate-110 group-focus-within:brightness-105 group-focus-within:saturate-110"
                    style={{ height: `${(item.resolved / maxValue) * 100}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ml-10 mt-2 grid min-w-0 grid-cols-4 gap-3 px-2 text-center text-xs text-slate-500 sm:ml-[52px] sm:gap-6 sm:px-3">
        {weeklyReportLoadMock.map((item) => (
          <span key={item.week}>{item.week}</span>
        ))}
      </div>
    </div>
  )
}
