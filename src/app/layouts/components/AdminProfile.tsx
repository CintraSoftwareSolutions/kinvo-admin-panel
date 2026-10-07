import { useRef, useState } from 'react'
import { navigateTo, routePaths } from '../../router/routePaths'
import { appConfig } from '../../../config/appConfig'
import { useAuth } from '../../../features/auth/hooks/useAuth'
import { appIcons } from '../../../shared/icons/appIcons'
import { useClickOutside } from '../../../shared/hooks/useClickOutside'

export function AdminProfile() {
  const { currentUser, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const profile = currentUser ?? appConfig.admin
  const LogoutIcon = appIcons.auth.logout
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  useClickOutside(rootRef, () => setOpen(false), open)

  function handleLogout() {
    logout()
    navigateTo(routePaths.login, { replace: true })
  }

  return (
    <div ref={rootRef} className="relative hidden sm:block">
      <button
        type="button"
        className="flex h-11 items-center gap-3 rounded-full border border-slate-300 bg-white px-3 pr-4 transition hover:border-violet-300"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {failed ? (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
            {initials}
          </span>
        ) : (
          <img
            src={profile.avatar}
            alt=""
            className="h-9 w-9 rounded-full object-cover"
            onError={() => setFailed(true)}
          />
        )}
        <span className="text-left leading-tight">
          <span className="block text-sm font-semibold text-slate-950">{profile.name}</span>
          <span className="block text-xs text-slate-500">{profile.role}</span>
        </span>
      </button>
      {open ? (
        <div className="absolute right-0 top-[52px] z-30 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_50px_rgba(16,24,40,0.12)]">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
            onClick={handleLogout}
          >
            <LogoutIcon className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  )
}
