/** 'safety_concern' -> 'Safety concern'. For enum values shown as text. */
export function humanize(value: string) {
  const text = value.replaceAll('_', ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}
