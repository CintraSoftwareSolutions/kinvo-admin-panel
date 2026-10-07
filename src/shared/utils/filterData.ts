export function filterData<TItem>(items: TItem[], predicate: (item: TItem) => boolean) {
  return items.filter(predicate)
}
