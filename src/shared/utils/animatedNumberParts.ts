export type AnimatedNumberParts = {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
}

export function getAnimatedNumberParts(value: string | number): AnimatedNumberParts | null {
  if (typeof value === 'number') {
    return { value, decimals: 0 }
  }

  const match = value.trim().match(/^([^0-9.-]*)(-?\d[\d,]*(?:\.\d+)?)(.*)$/)
  if (!match) {
    return null
  }

  const [, prefix, numericValue, suffix] = match
  const normalizedValue = Number(numericValue.replaceAll(',', ''))

  if (!Number.isFinite(normalizedValue)) {
    return null
  }

  const decimalValue = numericValue.split('.')[1]

  return {
    value: normalizedValue,
    prefix,
    suffix,
    decimals: decimalValue ? decimalValue.length : 0,
  }
}
