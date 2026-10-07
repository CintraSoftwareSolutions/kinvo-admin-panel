import { appIcons } from '../icons/appIcons'

type DataTablePaginationProps = {
  label: string
}

const PreviousIcon = appIcons.table.previous
const NextIcon = appIcons.table.next

export function DataTablePagination({ label }: DataTablePaginationProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-t border-slate-300 px-3 py-3 text-sm text-slate-500 sm:px-4">
      <button
        type="button"
        disabled
        className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 font-semibold text-slate-400"
      >
        <PreviousIcon className="h-4 w-4" />
        Previous
      </button>
      <div className="flex min-w-0 items-center gap-2">
        <span>{label}</span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 font-semibold text-white">
          1
        </span>
      </div>
      <button
        type="button"
        disabled
        className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 font-semibold text-slate-400"
      >
        Next
        <NextIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
