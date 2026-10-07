import type { CSSProperties } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ActionIconButton } from '../../../../shared/components/ActionIconButton'
import { appIcons } from '../../../../shared/icons/appIcons'
import { useClickOutside } from '../../../../shared/hooks/useClickOutside'
import { cn } from '../../../../shared/utils/cn'

export type QuickActionMenuItem = {
  label: string
  onSelect: () => void
  tone?: 'danger'
}

type QuickActionDropdownProps = {
  items: QuickActionMenuItem[]
}

const dropdownWidth = 220

export function QuickActionDropdown({ items }: QuickActionDropdownProps) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const closeDropdown = useCallback(() => setOpen(false), [])
  useClickOutside(containerRef, closeDropdown, open)

  const updatePosition = useCallback(() => {
    const button = buttonRef.current
    if (!button) {
      return
    }

    const rect = button.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const estimatedMenuHeight = items.length * 40 + 12

    if (viewportWidth < 600) {
      setMenuStyle({
        left: 16,
        right: 16,
        top: Math.min(rect.bottom + 8, viewportHeight - estimatedMenuHeight - 12),
      })
      return
    }

    setMenuStyle({
      left: Math.max(12, Math.min(rect.right - dropdownWidth, viewportWidth - dropdownWidth - 12)),
      top: Math.min(rect.bottom + 8, viewportHeight - estimatedMenuHeight - 12),
      width: dropdownWidth,
    })
  }, [items.length])

  useEffect(() => {
    if (!open) {
      return
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, updatePosition])

  return (
    <div ref={containerRef} className="relative">
      <ActionIconButton
        ref={buttonRef}
        icon={appIcons.actions.more}
        label="More actions"
        active={open}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      />
      {open ? (
        <div
          role="menu"
          className="fixed z-[70] rounded-2xl border border-slate-200 bg-white p-1 shadow-[0_18px_48px_rgba(15,23,42,0.16)]"
          style={menuStyle}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                item.onSelect()
              }}
              className={cn(
                'flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-violet-700',
                item.tone === 'danger' && 'text-rose-600 hover:bg-rose-50 hover:text-rose-700',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
