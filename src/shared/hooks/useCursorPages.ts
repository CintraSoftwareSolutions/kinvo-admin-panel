import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { apiList, type QueryParams } from '../../api/client'

type CursorPagesOptions = {
  queryKey: readonly unknown[]
  path: string
  params?: QueryParams
  limit?: number
  enabled?: boolean
}

/**
 * Cursor pagination presented as Previous / Next. Pages already fetched are kept,
 * so Previous is instant; Next fetches with the opaque next_cursor when needed.
 * Stops on has_more === false, never on an empty page or a null cursor alone.
 */
export function useCursorPages<T>({ queryKey, path, params, limit = 20, enabled = true }: CursorPagesOptions) {
  const fullKey = [...queryKey, params ?? {}, limit]
  const [pageState, setPageState] = useState({ key: JSON.stringify(fullKey), index: 0 })

  const query = useInfiniteQuery({
    queryKey: fullKey,
    enabled,
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) => apiList<T>(path, { ...params, limit, cursor: pageParam }, signal),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_more && lastPage.pagination.next_cursor ? lastPage.pagination.next_cursor : undefined,
  })

  // Filters changed: back to the first page without an effect.
  const keyString = JSON.stringify(fullKey)
  const pageIndex = pageState.key === keyString ? pageState.index : 0

  const pages = query.data?.pages ?? []
  const currentIndex = Math.min(pageIndex, Math.max(pages.length - 1, 0))
  const items = pages[currentIndex]?.items ?? []
  const hasNext = currentIndex < pages.length - 1 || Boolean(query.hasNextPage)

  async function next() {
    if (currentIndex >= pages.length - 1) {
      if (!query.hasNextPage) return
      await query.fetchNextPage()
    }
    setPageState({ key: keyString, index: currentIndex + 1 })
  }

  function previous() {
    setPageState({ key: keyString, index: Math.max(0, currentIndex - 1) })
  }

  return {
    items,
    isLoading: query.isPending,
    isFetchingNext: query.isFetchingNextPage,
    error: query.error,
    refetch: query.refetch,
    pagination: {
      page: currentIndex + 1,
      hasPrevious: currentIndex > 0,
      hasNext,
      loading: query.isFetchingNextPage,
      onPrevious: previous,
      onNext: () => void next(),
    },
  }
}

export type CursorPagination = ReturnType<typeof useCursorPages>['pagination']
