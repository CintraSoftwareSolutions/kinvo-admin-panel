import { appConfig } from '../../../config/appConfig'

type AuthHeaderProps = {
  title: string
  subtitle: string
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <header className="mb-7 text-center">
      <img src={appConfig.logoPath} alt="Kinvo" className="mx-auto h-14 w-14 rounded-2xl" />
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-600">Kinvo Admin</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
    </header>
  )
}
