import type { CursorPagination } from '../../../../shared/hooks/useCursorPages'
import { DataTable } from '../../../../shared/table/DataTable'
import type { DataTableColumn } from '../../../../shared/table/table.types'
import { formatDateTime } from '../../../../shared/utils/formatDate'
import { getPaginationLabel } from '../../../../shared/utils/pagination'
import type { AuditEntry } from '../../types/userManagement.types'
import { UserIdentity, UserMobileCard } from './UserMobileCard'

type AuditLogTableProps = {
  entries: AuditEntry[]
  loading: boolean
  error: unknown
  onRetry: () => void
  pagination: CursorPagination
}

function actorName(entry: AuditEntry) {
  return entry.admin?.display_name ?? 'System'
}

function target(entry: AuditEntry) {
  return entry.target_id ? `${entry.target_type} · ${entry.target_id.slice(0, 8)}` : entry.target_type
}

export function AuditLogTable({ entries, loading, error, onRetry, pagination }: AuditLogTableProps) {
  const columns: Array<DataTableColumn<AuditEntry>> = [
    {
      key: 'user',
      header: 'Operator',
      sortable: false,
      render: (entry) => (
        <UserIdentity name={actorName(entry)} avatar={entry.admin?.primary_photo_url ?? undefined} date={entry.ip_address ?? undefined} />
      ),
    },
    {
      key: 'action',
      header: 'Action',
      sortable: false,
      render: (entry) => <span className="font-mono text-xs font-semibold text-slate-800">{entry.action}</span>,
    },
    { key: 'target', header: 'Target', sortable: false, render: (entry) => <span title={entry.target_id ?? undefined}>{target(entry)}</span> },
    { key: 'date', header: 'When', sortable: false, render: (entry) => formatDateTime(entry.created_at) },
  ]

  return (
    <DataTable
      items={entries}
      columns={columns}
      getKey={(entry) => entry.id}
      loading={loading}
      error={error}
      onRetry={onRetry}
      pagination={pagination}
      paginationLabel={getPaginationLabel(entries.length, 'entries')}
      emptyTitle="No audit entries yet"
      emptyDescription="Admin actions are recorded here as they happen."
      renderMobileCard={(entry) => (
        <UserMobileCard
          key={entry.id}
          title={actorName(entry)}
          subtitle={entry.action}
          avatar={entry.admin?.primary_photo_url ?? undefined}
          rows={[
            { label: 'Target', value: target(entry) },
            { label: 'When', value: formatDateTime(entry.created_at) },
          ]}
        />
      )}
    />
  )
}
