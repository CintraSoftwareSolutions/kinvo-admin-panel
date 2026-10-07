import { formatCurrency } from '../../../../shared/utils/formatCurrency'
import { userSnapshotMock } from '../../data/userSnapshot.mock'
import { UserAvatar } from '../UserTable/UserMobileCard'

type HighValueMembersProps = {
  compact?: boolean
}

export function HighValueMembers({ compact }: HighValueMembersProps) {
  const members = compact ? userSnapshotMock.highValueMembers.slice(0, 3) : userSnapshotMock.highValueMembers

  return (
    <div className="grid gap-3">
      {members.map((member) => (
        <div
          key={member.name}
          className="flex items-center justify-between gap-4 rounded-[20px] border border-slate-300 bg-slate-50 px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            {member.avatar ? <UserAvatar name={member.name} avatar={member.avatar} /> : null}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">{member.name}</p>
              <p className="truncate text-xs text-slate-500">{member.detail}</p>
            </div>
          </div>
          <p className="font-semibold text-slate-950">{formatCurrency(member.value ?? 0)}</p>
        </div>
      ))}
    </div>
  )
}
