// Money arrives as integer minor units plus an ISO currency code. Format for display only.
export function formatMinor(amountMinor: number | null | undefined, currency: string | null | undefined) {
  if (amountMinor === null || amountMinor === undefined || !currency) return '—'
  const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency })
  const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2
  return formatter.format(amountMinor / 10 ** digits)
}

/** Parse a major-unit string typed by an operator ("19.99") into integer minor units. */
export function parseMajorToMinor(value: string, currency: string): number | null {
  const trimmed = value.trim()
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null
  const digits = new Intl.NumberFormat('en-GB', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2
  const [whole, fraction = ''] = trimmed.split('.')
  if (fraction.length > digits) return null
  return Number(whole) * 10 ** digits + Number(fraction.padEnd(digits, '0') || '0')
}
