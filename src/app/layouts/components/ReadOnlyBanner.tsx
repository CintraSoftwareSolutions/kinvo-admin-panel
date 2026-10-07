import { useReadOnly } from '../../../features/auth/hooks/useGuardrails'

/** While admin.read_only is on, every mutating admin endpoint answers 403. Say so up front. */
export function ReadOnlyBanner() {
  const readOnly = useReadOnly()

  if (!readOnly) {
    return null
  }

  return (
    <div role="status" className="border-b border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 sm:px-6 lg:px-7">
      <span className="font-semibold">Read-only mode is on.</span> Admin changes are paused for everyone: you can view data,
      but saving is disabled. An operator with roles.write can switch it off under User management → Roles & rights →
      Guardrails.
    </div>
  )
}
