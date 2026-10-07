import type { ReactNode } from 'react'
import { PageShell } from './PageShell'
import { PillTabs } from './PillTabs'
import type { AppIcon } from '../icons/appIcons'

export type AdminOperationsPill = {
  value: string
  label: string
  icon: AppIcon
}

type AdminOperationsShellProps = {
  pill: AdminOperationsPill
  label: string
  title: string
  children: ReactNode
}

export function AdminOperationsShell({ pill, label, title, children }: AdminOperationsShellProps) {
  return (
    <PageShell className="space-y-4">
      <PillTabs tabs={[pill]} activeTab={pill.value} onChange={() => undefined} />
      <section className="min-h-[calc(100vh-170px)] min-w-0 max-w-full overflow-x-hidden rounded-[28px] border border-violet-600 bg-white p-4 shadow-[0_18px_50px_rgba(16,24,40,0.05)] sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">{label}</p>
        <h2 className="mt-3 text-xl font-semibold text-slate-950">{title}</h2>
        <div className="mt-6 min-w-0 max-w-full">{children}</div>
      </section>
    </PageShell>
  )
}
