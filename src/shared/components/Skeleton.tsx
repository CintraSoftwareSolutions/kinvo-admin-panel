import { cn } from '../utils/cn'

type SkeletonProps = {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-xl bg-slate-100', className)} />
}
