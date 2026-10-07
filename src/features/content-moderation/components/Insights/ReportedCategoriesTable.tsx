import { SimpleTable } from '../../../../shared/table/SimpleTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import { reportedCategoriesMock } from '../../data/moderationInsights.mock'
import type { ReportedCategory } from '../../types/contentModeration.types'

export function ReportedCategoriesTable() {
  const columns: Array<DataTableColumn<ReportedCategory>> = [
    {
      key: 'reason',
      header: 'Reason',
      render: (category) => <span className="font-semibold text-slate-950">{category.reason}</span>,
    },
    { key: 'cases', header: 'Cases', render: (category) => category.cases },
  ]

  return <SimpleTable items={reportedCategoriesMock} columns={columns} getKey={(category) => category.reason} />
}
