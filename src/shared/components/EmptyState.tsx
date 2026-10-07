import { cn } from '../utils/cn'

type EmptyStateProps = {
  title?: string
  description?: string
  className?: string
}

export function EmptyState({
  title = 'No matching results found',
  description = 'Try a different keyword.',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-4 text-center',
        className,
      )}
    >
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{description}</p>
    </div>
  )
}
