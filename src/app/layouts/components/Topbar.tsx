import { ActionIconButton } from '../../../shared/components/ActionIconButton'
import { PageHeader } from '../../../shared/components/PageHeader'
import { appIcons } from '../../../shared/icons/appIcons'
import { AdminProfile } from './AdminProfile'
import { NotificationButton } from './NotificationButton'
import { TopbarSearch } from './TopbarSearch'

type TopbarProps = {
  title: string
  searchQuery: string
  onSearchChange: (value: string) => void
  onMenuClick: () => void
  searchPlaceholder: string
  titleBadge?: string
}

export function Topbar({ title, searchQuery, onSearchChange, onMenuClick, searchPlaceholder, titleBadge }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 min-w-0 max-w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[70px] w-full max-w-[1720px] min-w-0 items-center gap-2 px-3 sm:gap-4 sm:px-6 lg:px-7">
        <ActionIconButton
          icon={appIcons.actions.menu}
          label="Open navigation"
          onClick={onMenuClick}
          className="shrink-0 lg:hidden"
        />
        <div className="min-w-0 flex-1">
          <PageHeader title={title} badge={titleBadge} />
        </div>
        <div className="hidden min-w-0 flex-1 justify-end md:flex">
          <TopbarSearch value={searchQuery} onChange={onSearchChange} placeholder={searchPlaceholder} />
        </div>
        <NotificationButton />
        <AdminProfile />
      </div>
      <div className="min-w-0 max-w-full px-3 pb-3 sm:px-6 md:hidden">
        <TopbarSearch value={searchQuery} onChange={onSearchChange} placeholder={searchPlaceholder} />
      </div>
    </header>
  )
}
