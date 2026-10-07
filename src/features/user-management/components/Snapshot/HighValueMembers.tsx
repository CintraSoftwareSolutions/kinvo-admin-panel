import { formatNumber } from '../../../../shared/utils/formatNumber'
import type { NamedValue } from '../../types/userManagement.types'
import { UserAvatar } from '../UserTable/UserMobileCard'

type HighValueMembersProps = {
  members: NamedValue[]
  compact?: boolean
}

export function HighValueMembers({ members: allMembers, compact }: HighValueMembersProps) {
  const members = compact ? allMembers.slice(0, 3) : allMembers

  return (
    <div className="grid gap-3">
      {members.map((member) => (
        <div
          key={`${member.name}-${member.detail}`}
          className="flex items-center justify-between gap-4 rounded-[20px] border border-slate-300 bg-slate-50 px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            {member.avatar ? <UserAvatar name={member.name} avatar={member.avatar} /> : null}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">{member.name}</p>
              <p className="truncate text-xs text-slate-500">{member.detail}</p>
            </div>
          </div>
          <p className="font-semibold text-slate-950" title="Value as sent by the API; no currency is given">
            {member.value === undefined ? '—' : formatNumber(member.value)}
          </p>
        </div>
      ))}
    </div>
  )
}
