import { useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../../../shared/utils/cn'

type UserAvatarProps = {
  name: string
  avatar?: string
  className?: string
}

type UserIdentityProps = {
  name: string
  email?: string
  date?: string
  avatar?: string
}

type UserMobileCardProps = {
  title: string
  subtitle?: string
  avatar?: string
  rows: Array<{ label: string; value: ReactNode }>
  actions?: ReactNode
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

export function UserAvatar({ name, avatar, className }: UserAvatarProps) {
  const [failed, setFailed] = useState(false)

  if (!avatar || failed) {
    return (
      <span
        className={cn(
          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700',
          className,
        )}
      >
        {initials(name)}
      </span>
    )
  }

  return (
    <img
      src={avatar}
      alt=""
      className={cn('h-11 w-11 shrink-0 rounded-full object-cover', className)}
      onError={() => setFailed(true)}
    />
  )
}

export function UserIdentity({ name, email, date, avatar }: UserIdentityProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar name={name} avatar={avatar} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-950">{name}</p>
        <p className="truncate text-xs text-slate-500">{email ?? date}</p>
      </div>
    </div>
  )
}

export function UserMobileCard({ title, subtitle, avatar, rows, actions }: UserMobileCardProps) {
  return (
    <article className="max-w-full min-w-0 rounded-2xl border border-slate-300 bg-white p-4">
      <div className="mb-4 flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name={title} avatar={avatar} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">{title}</p>
            {subtitle ? <p className="truncate text-xs text-slate-500">{subtitle}</p> : null}
          </div>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="grid min-w-0 gap-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex min-w-0 items-center justify-between gap-3">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{row.label}</span>
            <span className="min-w-0 text-right text-slate-700">{row.value}</span>
          </div>
        ))}
      </div>
    </article>
  )
}
