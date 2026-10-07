export function sortData<TItem>(items: TItem[], compare: (left: TItem, right: TItem) => number) {
  return [...items].sort(compare)
}
