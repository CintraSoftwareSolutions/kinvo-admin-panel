import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ActionIconButton } from '../../../shared/components/ActionIconButton'
import { appIcons } from '../../../shared/icons/appIcons'
import type { RoutePath } from '../../router/routePaths'
import { Sidebar } from './Sidebar'

type MobileSidebarProps = {
  open: boolean
  onClose: () => void
  currentPath: string
  onNavigate: (path: RoutePath) => void
}

export function MobileSidebar({ open, onClose, currentPath, onNavigate }: MobileSidebarProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  function handleNavigate(path: RoutePath) {
    onNavigate(path)
    onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 overflow-hidden bg-slate-950/40 backdrop-blur-sm lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative h-full w-[276px] max-w-[calc(100vw-24px)]"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            onClick={(event) => event.stopPropagation()}
          >
            <Sidebar mobile currentPath={currentPath} onNavigate={handleNavigate} />
            <div className="absolute right-3 top-3">
              <ActionIconButton icon={appIcons.actions.close} label="Close navigation" onClick={onClose} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
