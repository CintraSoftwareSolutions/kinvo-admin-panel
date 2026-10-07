// Cursor lists have no total count, so the label describes the current page only.
export function getPaginationLabel(count: number, noun: string) {
  return `${count} ${noun} on this page`
}
