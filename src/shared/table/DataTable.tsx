import type { ReactNode } from 'react'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import type { CursorPagination } from '../hooks/useCursorPages'
import { appIcons } from '../icons/appIcons'
import { cn } from '../utils/cn'
import { DataTablePagination } from './DataTablePagination'
import { DataTableSkeleton } from './DataTableSkeleton'
import type { DataTableColumn } from './table.types'

type DataTableProps<TItem> = {
  items: TItem[]
  columns: Array<DataTableColumn<TItem>>
  getKey: (item: TItem) => string
  renderMobileCard: (item: TItem) => ReactNode
  paginationLabel: string
  selectable?: boolean
  pagination?: CursorPagination
  loading?: boolean
  error?: unknown
  onRetry?: () => void
  emptyTitle?: string
  emptyDescription?: string
}

const SortIcon = appIcons.table.sort

export function DataTable<TItem>({
  items,
  columns,
  getKey,
  renderMobileCard,
  paginationLabel,
  selectable,
  pagination,
  loading,
  error,
  onRetry,
  emptyTitle,
  emptyDescription,
}: DataTableProps<TItem>) {
  if (loading) {
    return <DataTableSkeleton />
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />
  }

  if (items.length === 0 && !pagination?.hasPrevious) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="max-w-full min-w-0 overflow-hidden rounded-[24px] border border-slate-300 bg-white">
      <div className="hidden max-w-full min-w-0 overflow-x-auto overscroll-x-contain lg:block">
        <table className="w-full min-w-[1180px] table-auto border-collapse text-left">
          <thead className="bg-slate-50">
            <tr className="h-12 border-b border-slate-300">
              {selectable ? (
                <th className="w-14 px-4">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300" aria-label="Select all rows" />
                </th>
              ) : null}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400',
                    getColumnWidthClass(column.key),
                    column.className,
                  )}
                >
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    {column.header}
                    {column.sortable === false ? null : <SortIcon className="h-3.5 w-3.5 text-slate-500" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={getKey(item)} className="h-[68px] border-b border-slate-300 last:border-b-0">
                {selectable ? (
                  <td className="px-4">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300" aria-label="Select row" />
                  </td>
                ) : null}
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-4 text-sm text-slate-600', getColumnWidthClass(column.key), column.className)}>
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid max-w-full min-w-0 gap-3 p-3 lg:hidden">{items.map((item) => renderMobileCard(item))}</div>
      <DataTablePagination label={paginationLabel} pagination={pagination} />
    </div>
  )
}

function getColumnWidthClass(columnKey: string) {
  const columnWidthClasses: Record<string, string> = {
    user: 'min-w-[260px]',
    joinDate: 'min-w-[150px]',
    startDate: 'min-w-[150px]',
    date: 'min-w-[150px]',
    subscriptionPlan: 'min-w-[220px]',
    plan: 'min-w-[180px]',
    renewalDate: 'min-w-[160px]',
    lastActive: 'min-w-[150px]',
    mode: 'min-w-[160px]',
    paymentMethod: 'min-w-[170px]',
    paymentStatus: 'min-w-[170px]',
    status: 'min-w-[150px]',
    state: 'min-w-[140px]',
    actions: 'min-w-[170px]',
  }

  return columnWidthClasses[columnKey] ?? 'min-w-[140px]'
}
