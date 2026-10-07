import { appIcons } from '../icons/appIcons'
import { cn } from '../utils/cn'
import type { CursorPagination } from '../hooks/useCursorPages'

type DataTablePaginationProps = {
  label: string
  pagination?: CursorPagination
}

const PreviousIcon = appIcons.table.previous
const NextIcon = appIcons.table.next

const buttonClass =
  'inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 font-semibold transition enabled:text-slate-700 enabled:hover:border-violet-300 enabled:hover:text-violet-700 disabled:text-slate-400'

export function DataTablePagination({ label, pagination }: DataTablePaginationProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-t border-slate-300 px-3 py-3 text-sm text-slate-500 sm:px-4">
      <button
        type="button"
        disabled={!pagination?.hasPrevious}
        onClick={pagination?.onPrevious}
        className={buttonClass}
      >
        <PreviousIcon className="h-4 w-4" />
        Previous
      </button>
      <div className="flex min-w-0 items-center gap-2">
        <span>{label}</span>
        <span
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 font-semibold text-white',
            pagination?.loading && 'animate-pulse',
          )}
        >
          {pagination?.page ?? 1}
        </span>
      </div>
      <button
        type="button"
        disabled={!pagination?.hasNext || pagination.loading}
        onClick={pagination?.onNext}
        className={buttonClass}
      >
        Next
        <NextIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
