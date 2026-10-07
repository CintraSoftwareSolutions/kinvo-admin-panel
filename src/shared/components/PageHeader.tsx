type PageHeaderProps = {
  title: string
  badge?: string
}

export function PageHeader({ title, badge }: PageHeaderProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-3">
      <h1 className="min-w-0 text-[22px] font-semibold leading-tight tracking-[0px] text-slate-950 sm:text-[24px]">{title}</h1>
      {badge ? (
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">{badge}</span>
      ) : null}
    </div>
  )
}
