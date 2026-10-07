import type { InputHTMLAttributes } from 'react'
import { useRef } from 'react'
import { appIcons } from '../icons/appIcons'
import { cn } from '../utils/cn'

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>

const SearchIcon = appIcons.forms.search

export function SearchInput({ className, ...props }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={cn('relative block min-w-0 max-w-full', className)}>
      <button
        type="button"
        aria-label="Focus search"
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500 transition hover:text-violet-700"
        onClick={() => inputRef.current?.focus()}
      >
        <SearchIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      <input
        ref={inputRef}
        className="h-11 w-full rounded-full border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        {...props}
      />
    </div>
  )
}
