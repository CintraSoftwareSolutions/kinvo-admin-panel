import { useMemo, useState } from 'react'

export function usePagination<TItem>(items: TItem[], pageSize: number) {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const pagedItems = useMemo(() => items.slice((page - 1) * pageSize, page * pageSize), [items, page, pageSize])

  return { page, pageCount, pagedItems, setPage }
}
