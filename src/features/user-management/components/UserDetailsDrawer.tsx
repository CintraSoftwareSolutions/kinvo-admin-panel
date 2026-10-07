import { Modal } from '../../../shared/components/Modal'
import { RiskBadge } from '../../../shared/components/RiskBadge'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import type { User } from '../types/userManagement.types'
import { UserIdentity } from './UserTable/UserMobileCard'

type UserDetailsDrawerProps = {
  user: User | null
  onClose: () => void
}

export function UserDetailsDrawer({ user, onClose }: UserDetailsDrawerProps) {
  return (
    <Modal open={Boolean(user)} title="User details" onClose={onClose}>
      {user ? (
        <div className="grid gap-5">
          <UserIdentity name={user.name} email={user.email} avatar={user.avatar} />
          <div className="grid gap-3 rounded-2xl border border-slate-300 bg-slate-50 p-4 sm:grid-cols-2">
            <Detail label="Plan" value={user.plan} />
            <Detail label="Joined" value={user.joinDate} />
            <Detail label="Last active" value={user.lastActive} />
            <Detail label="Mode" value={user.mode} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Status</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge status={user.status} />
                <RiskBadge risk={user.risk} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
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
