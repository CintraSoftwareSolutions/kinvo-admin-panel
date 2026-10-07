import type { ReactNode } from 'react'

export type DataTableColumn<TItem> = {
  key: string
  header: string
  className?: string
  sortable?: boolean
  render: (item: TItem) => ReactNode
}
