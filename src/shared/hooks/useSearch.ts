import { useMemo } from 'react'

export function useSearch<TItem>(items: TItem[], query: string, selector: (item: TItem) => string[]) {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      return items
    }

    return items.filter((item) =>
      selector(item).some((value) => value.toLowerCase().includes(normalizedQuery)),
    )
  }, [items, query, selector])
}
