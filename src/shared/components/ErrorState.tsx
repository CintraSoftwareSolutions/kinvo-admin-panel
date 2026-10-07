import { isApiError } from '../../api/client'
import { cn } from '../utils/cn'
import { getErrorMessage } from '../utils/errorMessage'

type ErrorStateProps = {
  error: unknown
  title?: string
  onRetry?: () => void
  className?: string
}

/** Shows the API's own message, and on a 403 names the permission that was missing. */
export function ErrorState({ error, title = 'Couldn’t load this data', onRetry, className }: ErrorStateProps) {
  const message = getErrorMessage(error)
  const permission = isApiError(error) ? error.requiredPermission : null

  return (
    <div
      role="alert"
      className={cn(
        'flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-rose-50/40 px-4 py-6 text-center',
        className,
      )}
    >
      <p className="text-sm font-semibold text-slate-800">{permission ? 'You don’t have access to this' : title}</p>
      <p className="mt-1 max-w-md text-sm font-medium text-slate-600">{message}</p>
      {permission ? <PermissionChip permission={permission} className="mt-3" /> : null}
      {onRetry && !permission ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex h-9 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-violet-300 hover:text-violet-700"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}

export function PermissionChip({ permission, className }: { permission: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-700',
        className,
      )}
    >
      Requires <span className="text-violet-700">{permission}</span>
    </span>
  )
}
