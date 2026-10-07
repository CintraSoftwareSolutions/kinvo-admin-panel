import { useCallback, useRef, useState } from 'react'
import { usePermissions } from '../../../features/auth/hooks/usePermissions'
import { useEscalations, useModerationInsights } from '../../../features/content-moderation/api/contentModeration.api'
import { ActionIconButton } from '../../../shared/components/ActionIconButton'
import { appIcons } from '../../../shared/icons/appIcons'
import { useClickOutside } from '../../../shared/hooks/useClickOutside'
import { cn } from '../../../shared/utils/cn'
import { navigateTo, routePaths } from '../../router/routePaths'

/**
 * There is no admin notification feed in the API, so the bell shows work that is
 * actually waiting — counts from the moderation endpoints — rather than events.
 */
export function NotificationButton() {
  const { can } = usePermissions()

  if (!can('moderation.read')) {
    return null
  }

  return <WorkWaitingButton />
}

const QueueIcon = appIcons.contentModeration.queue
const EscalationIcon = appIcons.contentModeration.escalations

function WorkWaitingButton() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const insights = useModerationInsights()
  const escalations = useEscalations()

  const closePanel = useCallback(() => setOpen(false), [])
  useClickOutside(containerRef, closePanel, open)

  const escalationCount = escalations.data?.length ?? 0
  const queueItems = (insights.data?.queueHealth ?? []).filter((item) => item.label !== 'Resolved')

  function goToModeration() {
    setOpen(false)
    navigateTo(routePaths.contentModeration)
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <div className="relative">
        <ActionIconButton
          icon={appIcons.actions.notifications}
          label="Work waiting"
          className="h-11 w-11"
          active={open}
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((currentOpen) => !currentOpen)}
        />
        {escalationCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-violet-600 px-1 text-[10px] font-semibold leading-none text-white">
            {escalationCount}
          </span>
        ) : null}
      </div>
      {open ? (
        <div className="fixed left-4 right-4 top-[64px] z-50 rounded-[24px] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.16)] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[360px]">
          <div className="border-b border-slate-200 px-4 py-3">
            <p className="text-sm font-semibold text-slate-950">Work waiting</p>
            <p className="text-xs text-slate-500">Live counts from the moderation queue</p>
          </div>
          <div className="grid gap-1 p-2">
            <Item
              icon={EscalationIcon}
              tone="rose"
              title={`${escalationCount} open escalation${escalationCount === 1 ? '' : 's'}`}
              description="High and Medium severity cases"
              onClick={goToModeration}
            />
            {queueItems.map((item) => (
              <Item
                key={item.label}
                icon={QueueIcon}
                tone="violet"
                title={`${item.value} ${item.label.toLowerCase()}`}
                description={item.description ?? ''}
                onClick={goToModeration}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

type ItemProps = {
  icon: typeof QueueIcon
  tone: 'rose' | 'violet'
  title: string
  description: string
  onClick: () => void
}

function Item({ icon: Icon, tone, title, description, onClick }: ItemProps) {
  return (
    <button type="button" onClick={onClick} className="flex gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-slate-50">
      <span
        className={cn(
          'mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl',
          tone === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-violet-50 text-violet-700',
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-5 text-slate-950">{title}</span>
        {description ? <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span> : null}
      </span>
    </button>
  )
}
