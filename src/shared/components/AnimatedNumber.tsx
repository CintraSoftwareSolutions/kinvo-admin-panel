import { useEffect, useMemo, useRef, useState } from 'react'

type AnimatedNumberProps = {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  delay?: number
  className?: string
  useGrouping?: boolean
}

const prefersReducedMotionQuery = '(prefers-reduced-motion: reduce)'

function getPrefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(prefersReducedMotionQuery).matches
}

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3)
}

function formatAnimatedValue(value: number, decimals: number, useGrouping: boolean) {
  return value.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
    useGrouping,
  })
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 900,
  delay = 0,
  className,
  useGrouping = true,
}: AnimatedNumberProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<number | null>(null)
  const delayRef = useRef<number | null>(null)
  const [displayValue, setDisplayValue] = useState(() => (getPrefersReducedMotion() ? value : 0))

  const formattedValue = useMemo(
    () => `${prefix}${formatAnimatedValue(displayValue, decimals, useGrouping)}${suffix}`,
    [decimals, displayValue, prefix, suffix, useGrouping],
  )

  useEffect(() => {
    const element = elementRef.current
    let observer: IntersectionObserver | null = null
    let isCancelled = false

    const clearAnimation = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }

      if (delayRef.current !== null) {
        window.clearTimeout(delayRef.current)
        delayRef.current = null
      }
    }

    const runAnimation = () => {
      clearAnimation()

      if (getPrefersReducedMotion()) {
        setDisplayValue(value)
        return
      }

      setDisplayValue(0)

      delayRef.current = window.setTimeout(() => {
        const startedAt = window.performance.now()

        const step = (currentTime: number) => {
          if (isCancelled) {
            return
          }

          const elapsed = currentTime - startedAt
          const progress = Math.min(elapsed / duration, 1)
          setDisplayValue(value * easeOutCubic(progress))

          if (progress < 1) {
            frameRef.current = window.requestAnimationFrame(step)
            return
          }

          frameRef.current = null
          setDisplayValue(value)
        }

        frameRef.current = window.requestAnimationFrame(step)
      }, delay)
    }

    if (!element || typeof IntersectionObserver === 'undefined') {
      runAnimation()
      return () => {
        isCancelled = true
        clearAnimation()
      }
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          runAnimation()
          observer?.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(element)

    return () => {
      isCancelled = true
      observer?.disconnect()
      clearAnimation()
    }
  }, [delay, duration, value])

  return (
    <span ref={elementRef} className={className}>
      {formattedValue}
    </span>
  )
}
