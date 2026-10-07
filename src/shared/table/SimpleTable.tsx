import type { DataTableColumn } from './table.types'
import { EmptyState } from '../components/EmptyState'
import { cn } from '../utils/cn'

type SimpleTableProps<TItem> = {
  items: TItem[]
  columns: Array<DataTableColumn<TItem>>
  getKey: (item: TItem) => string
  minWidth?: string
}

export function SimpleTable<TItem>({ items, columns, getKey, minWidth = '640px' }: SimpleTableProps<TItem>) {
  if (items.length === 0) {
    return <EmptyState className="mt-6" />
  }

  return (
    <div className="mt-6 max-w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-[24px] border border-slate-300 bg-white">
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead className="bg-slate-50">
          <tr className="h-12 border-b border-slate-300">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'whitespace-nowrap px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400',
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={getKey(item)} className="h-14 border-b border-slate-300 last:border-b-0">
              {columns.map((column) => (
                <td key={column.key} className={cn('px-4 text-sm text-slate-600', column.className)}>
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
