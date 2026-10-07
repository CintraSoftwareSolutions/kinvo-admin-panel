import { isApiError } from '../../api/client'
import { cn } from '../utils/cn'
import { getErrorMessage } from '../utils/errorMessage'
import { PermissionChip } from './ErrorState'

/** A failed action: the API's message, plus the missing permission on a 403. */
export function InlineError({ error, className }: { error: unknown; className?: string }) {
  if (!error) return null
  const permission = isApiError(error) ? error.requiredPermission : null

  return (
    <div role="alert" className={cn('rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700', className)}>
      <p>{getErrorMessage(error)}</p>
      {permission ? <PermissionChip permission={permission} className="mt-2" /> : null}
    </div>
  )
}
