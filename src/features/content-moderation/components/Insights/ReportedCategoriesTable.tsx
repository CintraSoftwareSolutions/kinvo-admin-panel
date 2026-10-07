import { EmptyState } from '../../../../shared/components/EmptyState'
import { SimpleTable } from '../../../../shared/table/SimpleTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import { humanize } from '../../../../shared/utils/humanize'
import type { ReportedCategory } from '../../types/contentModeration.types'

export function ReportedCategoriesTable({ categories }: { categories: ReportedCategory[] }) {
  const columns: Array<DataTableColumn<ReportedCategory>> = [
    {
      key: 'reason',
      header: 'Reason',
      render: (category) => <span className="font-semibold text-slate-950">{humanize(category.reason)}</span>,
    },
    { key: 'cases', header: 'Cases', render: (category) => category.cases },
  ]

  if (categories.length === 0) {
    return <EmptyState title="No reports yet" description="Categories appear once reports come in." className="mt-6" />
  }

  return <SimpleTable items={categories} columns={columns} getKey={(category) => category.reason} />
}
