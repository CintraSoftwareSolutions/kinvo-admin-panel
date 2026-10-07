import { useState } from 'react'
import { useActionGate } from '../../../auth/hooks/usePermissions'
import { InlineError } from '../../../../shared/components/InlineError'
import { Modal } from '../../../../shared/components/Modal'
import { StatusBadge } from '../../../../shared/components/StatusBadge'
import { Textarea } from '../../../../shared/forms/Textarea'
import { useChangeUserRole, useReinstateUser, useSuspendUser } from '../../api/userManagement.api'
import type { StaffRole, User } from '../../types/userManagement.types'
import { HonestFields } from './AllUsersTable'

const primaryButton =
  'h-11 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(111,61,204,0.26)] transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300 disabled:shadow-none'
const dangerButton =
  'h-11 rounded-full bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300'
const secondaryButton =
  'h-11 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700'

function UserSummary({ user }: { user: User }) {
  return (
    <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
      <div className="flex items-start justify-between gap-4">
        <span className="font-semibold text-slate-500">User</span>
        <span className="text-right font-semibold text-slate-950">{user.name}</span>
      </div>
      <div className="flex items-start justify-between gap-4">
        <span className="font-semibold text-slate-500">Email</span>
        <span className="text-right font-semibold text-slate-950">{user.email ?? '—'}</span>
      </div>
      <div className="flex items-start justify-between gap-4">
        <span className="font-semibold text-slate-500">Status</span>
        <span className="grid justify-items-end gap-1">
          <StatusBadge status={user.status} />
          <HonestFields user={user} />
        </span>
      </div>
    </div>
  )
}

type ModalProps = {
  user: User | null
  onClose: () => void
}

/** Suspend (reason required) or reinstate, depending on the honest account_status. */
export function AccountActionModal({ user, onClose }: ModalProps) {
  return (
    <Modal open={Boolean(user)} title={user?.account_status === 'suspended' ? 'Reinstate account' : 'Suspend account'} onClose={onClose}>
      {user ? <AccountActionBody key={user.id} user={user} onClose={onClose} /> : null}
    </Modal>
  )
}

function AccountActionBody({ user, onClose }: { user: User; onClose: () => void }) {
  const [reason, setReason] = useState('')
  const suspend = useSuspendUser()
  const reinstate = useReinstateUser()
  const gate = useActionGate()('users.suspend')
  const isSuspended = user.account_status === 'suspended'
  const mutation = isSuspended ? reinstate : suspend
  const reasonValid = reason.trim().length >= 3

  function handleConfirm() {
    if (isSuspended) {
      reinstate.mutate({ id: user.id }, { onSuccess: onClose })
    } else if (reasonValid) {
      suspend.mutate({ id: user.id, reason: reason.trim() }, { onSuccess: onClose })
    }
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm leading-6 text-slate-600">
        {isSuspended
          ? 'The account becomes active again on its next request.'
          : 'Suspension takes effect on the member’s next request — the server reloads the account every time.'}
      </p>
      <UserSummary user={user} />
      {!isSuspended ? (
        <Textarea
          label="Reason (required, shown in the audit log)"
          value={reason}
          minLength={3}
          placeholder="e.g. Repeated payment-link spam reported by three members"
          onChange={(event) => setReason(event.target.value)}
        />
      ) : null}
      <InlineError error={mutation.error} />
      <div className="flex flex-wrap justify-end gap-3 pt-1">
        <button type="button" onClick={onClose} className={secondaryButton}>
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!gate.allowed || mutation.isPending || (!isSuspended && !reasonValid)}
          title={gate.reason}
          className={isSuspended ? primaryButton : dangerButton}
        >
          {mutation.isPending ? 'Saving…' : isSuspended ? 'Reinstate' : 'Suspend'}
        </button>
      </div>
    </div>
  )
}

const roleOptions: Array<{ value: StaffRole; label: string; description: string }> = [
  { value: 'user', label: 'Member', description: 'No admin access. Demotion also clears granular role memberships.' },
  { value: 'moderator', label: 'Moderator', description: 'Staff access, limited by the permissions of their roles.' },
  { value: 'admin', label: 'Administrator', description: 'Staff access with administrator standing.' },
]

export function ChangeRoleModal({ user, onClose }: ModalProps) {
  return (
    <Modal open={Boolean(user)} title="Change staff role" onClose={onClose}>
      {user ? <ChangeRoleBody key={user.id} user={user} onClose={onClose} /> : null}
    </Modal>
  )
}

function ChangeRoleBody({ user, onClose }: { user: User; onClose: () => void }) {
  const [role, setRole] = useState<StaffRole>(user.staff_role)
  const changeRole = useChangeUserRole()
  const gate = useActionGate()('users.role')

  return (
    <div className="grid gap-4">
      <UserSummary user={user} />
      <div className="grid gap-2">
        {roleOptions.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-violet-300 hover:bg-violet-50/40"
          >
            <input
              type="radio"
              checked={role === option.value}
              onChange={() => setRole(option.value)}
              className="mt-1 h-4 w-4 border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-950">
                {option.label}
                {option.value === user.staff_role ? <span className="ml-2 text-xs text-slate-400">(current)</span> : null}
              </span>
              <span className="mt-1 block text-xs text-slate-500">{option.description}</span>
            </span>
          </label>
        ))}
      </div>
      {/* 409 CONFLICT covers: your own role, the last administrator, and demotion side effects. */}
      <InlineError error={changeRole.error} />
      <div className="flex flex-wrap justify-end gap-3 pt-1">
        <button type="button" onClick={onClose} className={secondaryButton}>
          Cancel
        </button>
        <button
          type="button"
          disabled={!gate.allowed || changeRole.isPending || role === user.staff_role}
          title={gate.reason}
          onClick={() => changeRole.mutate({ id: user.id, role }, { onSuccess: onClose })}
          className={primaryButton}
        >
          {changeRole.isPending ? 'Saving…' : 'Save role'}
        </button>
      </div>
    </div>
  )
}
