import type { ReactNode } from 'react'
import { EmptyState } from '../../../shared/components/EmptyState'
import { ErrorState } from '../../../shared/components/ErrorState'
import { Modal } from '../../../shared/components/Modal'
import { RiskBadge } from '../../../shared/components/RiskBadge'
import { Skeleton } from '../../../shared/components/Skeleton'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { formatDate, formatRelative } from '../../../shared/utils/formatDate'
import { useUserActivityLog, useUserDetail, useUserMembership } from '../api/userManagement.api'
import type { User } from '../types/userManagement.types'
import { HonestFields } from './UserTable/AllUsersTable'
import { UserIdentity } from './UserTable/UserMobileCard'

type UserDetailsDrawerProps = {
  user: User | null
  onClose: () => void
}

export function UserDetailsDrawer({ user, onClose }: UserDetailsDrawerProps) {
  return (
    <Modal open={Boolean(user)} title="User details" onClose={onClose}>
      {user ? <UserDetailsBody user={user} /> : null}
    </Modal>
  )
}

function UserDetailsBody({ user }: { user: User }) {
  const detail = useUserDetail(user.id)
  const membership = useUserMembership(user.id)
  const activity = useUserActivityLog(user.id)
  const current = detail.data ?? user

  return (
    <div className="grid gap-5">
      <UserIdentity name={current.name} email={current.email ?? undefined} avatar={current.avatar ?? undefined} />
      <div className="grid gap-3 rounded-2xl border border-slate-300 bg-slate-50 p-4 sm:grid-cols-2">
        <Detail label="Plan" value={`${current.plan} (tier: ${current.tier})`} />
        <Detail label="Joined" value={formatDate(current.joinDate)} />
        <Detail label="Last active" value={formatRelative(current.lastActive)} />
        <Detail label="Mode" value={current.mode} />
        <div className="sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Status</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={current.status} />
            <RiskBadge risk={current.risk} />
            <HonestFields user={current} />
          </div>
          {current.suspended_at ? (
            <p className="mt-2 text-xs text-rose-700">
              Suspended {formatDate(current.suspended_at)}
              {current.suspension_reason ? ` — ${current.suspension_reason}` : ''}
            </p>
          ) : null}
        </div>
      </div>

      <Section title="Counts">
        {detail.isPending ? (
          <Skeleton className="h-20" />
        ) : detail.error ? (
          <ErrorState error={detail.error} onRetry={() => void detail.refetch()} />
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Count label="Matches" value={detail.data.counts.matches} />
            <Count label="Reports received" value={detail.data.counts.reports_received} />
            <Count label="Reports filed" value={detail.data.counts.reports_filed} />
            <Count label="Blocks received" value={detail.data.counts.blocks_received} />
            <Count label="Open flags" value={detail.data.counts.open_flags} />
            <Count label="Risk score" value={detail.data.risk_score} />
          </div>
        )}
      </Section>

      <Section title="Membership history">
        {membership.isPending ? (
          <Skeleton className="h-16" />
        ) : membership.error ? (
          <ErrorState error={membership.error} onRetry={() => void membership.refetch()} />
        ) : membership.data.length === 0 ? (
          <EmptyState title="No subscriptions" description="This member has never subscribed." className="min-h-24" />
        ) : (
          <div className="grid gap-2">
            {membership.data.map((row) => (
              <Row
                key={row.id}
                title={row.subscriptionPlan}
                detail={`${formatDate(row.startDate)} → ${row.renewalDate ? formatDate(row.renewalDate) : '—'} · ${row.paymentMethod} · ${row.status}`}
                badge={<StatusBadge status={row.paymentStatus} />}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="Recorded activity">
        {activity.isPending ? (
          <Skeleton className="h-16" />
        ) : activity.error ? (
          <ErrorState error={activity.error} onRetry={() => void activity.refetch()} />
        ) : activity.data.length === 0 ? (
          <EmptyState title="No recorded events" description="Only recorded events appear here." className="min-h-24" />
        ) : (
          <div className="grid gap-2">
            {activity.data.map((row) => (
              <Row
                key={row.id}
                title={row.planEvent !== '—' ? row.planEvent : row.recentAction}
                detail={`${formatDate(row.date)} · ${row.recentAction}${row.trustEvent !== '—' ? ` · ${row.trustEvent}` : ''}`}
                badge={<StatusBadge status={row.state} />}
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">{title}</p>
      {children}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function Row({ title, detail, badge }: { title: string; detail: string; badge: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-950">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{detail}</p>
      </div>
      <span className="shrink-0">{badge}</span>
    </div>
  )
}
