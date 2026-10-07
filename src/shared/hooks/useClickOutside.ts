import { useEffect } from 'react'
import type { RefObject } from 'react'

export function useClickOutside<TElement extends HTMLElement>(
  ref: RefObject<TElement | null>,
  onClickOutside: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      const element = ref.current
      if (!element || element.contains(event.target as Node)) {
        return
      }

      onClickOutside()
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [enabled, onClickOutside, ref])
}
