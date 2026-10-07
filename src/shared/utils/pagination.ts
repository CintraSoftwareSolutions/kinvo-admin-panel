export function getPaginationLabel(total: number, noun: string) {
  return `1-${total} of ${total} ${noun}`
}
