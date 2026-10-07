import { useEffect, useState } from 'react'

export function useDebounce<TValue>(value: TValue, delay = 180) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(timer)
  }, [delay, value])

  return debouncedValue
}
