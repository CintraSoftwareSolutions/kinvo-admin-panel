import { useMemo, useState } from 'react'

export type SortDirection = 'asc' | 'desc'

export function useSort<TItem>(items: TItem[], initialKey: keyof TItem) {
  const [sortKey, setSortKey] = useState<keyof TItem>(initialKey)
  const [direction, setDirection] = useState<SortDirection>('asc')

  const sortedItems = useMemo(() => {
    return [...items].sort((left, right) => {
      const leftValue = String(left[sortKey])
      const rightValue = String(right[sortKey])
      const result = leftValue.localeCompare(rightValue)
      return direction === 'asc' ? result : -result
    })
  }, [direction, items, sortKey])

  const toggleSort = (key: keyof TItem) => {
    if (key === sortKey) {
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setDirection('asc')
  }

  return { direction, sortKey, sortedItems, toggleSort }
}
