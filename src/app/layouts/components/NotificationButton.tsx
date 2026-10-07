import { useCallback, useMemo, useRef, useState } from 'react'
import { ActionIconButton } from '../../../shared/components/ActionIconButton'
import { appIcons } from '../../../shared/icons/appIcons'
import { useClickOutside } from '../../../shared/hooks/useClickOutside'
import { cn } from '../../../shared/utils/cn'
import { topbarNotificationsMock } from '../data/notifications.mock'
import type { TopbarNotification } from '../data/notifications.mock'

const notificationToneStyles: Record<TopbarNotification['tone'], string> = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  orange: 'bg-orange-50 text-orange-600',
  rose: 'bg-rose-50 text-rose-600',
  violet: 'bg-violet-50 text-violet-700',
}

export function NotificationButton() {
  const [open, setOpen] = useState(false)
  const [readNotificationIds, setReadNotificationIds] = useState<ReadonlySet<string>>(() => new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  const notifications = useMemo(
    () =>
      topbarNotificationsMock.map((notification) => ({
        ...notification,
        unread: notification.unread && !readNotificationIds.has(notification.id),
      })),
    [readNotificationIds],
  )
  const unreadCount = notifications.filter((notification) => notification.unread).length

  const closeNotifications = useCallback(() => setOpen(false), [])
  useClickOutside(containerRef, closeNotifications, open)

  function handleMarkAllAsRead() {
    setReadNotificationIds(new Set(topbarNotificationsMock.map((notification) => notification.id)))
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <div className="relative">
        <ActionIconButton
          icon={appIcons.actions.notifications}
          label="Notifications"
          className="h-11 w-11"
          active={open}
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((currentOpen) => !currentOpen)}
        />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-violet-600 px-1 text-[10px] font-semibold leading-none text-white">
            {unreadCount}
          </span>
        ) : null}
      </div>
      {open ? (
        <div className="fixed left-4 right-4 top-[64px] z-50 rounded-[24px] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.16)] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[360px]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">Notifications</p>
              <p className="text-xs text-slate-500">{unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up'}</p>
            </div>
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="rounded-full px-3 py-1 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              Mark all as read
            </button>
          </div>
          <div className="max-h-[360px] overflow-y-auto p-2">
            {notifications.map((notification) => {
              const NotificationIcon = notification.icon

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'flex gap-3 rounded-2xl px-3 py-3 transition hover:bg-slate-50',
                    notification.unread && 'bg-violet-50/50',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl',
                      notificationToneStyles[notification.tone],
                    )}
                  >
                    <NotificationIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-5 text-slate-950">{notification.title}</p>
                      {notification.unread ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-600" /> : null}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{notification.description}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {notification.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
