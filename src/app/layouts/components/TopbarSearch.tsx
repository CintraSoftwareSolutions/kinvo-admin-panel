import { SearchInput } from '../../../shared/forms/SearchInput'

type TopbarSearchProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TopbarSearch({ value, onChange, placeholder = 'Search user management data' }: TopbarSearchProps) {
  return (
    <SearchInput
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full min-w-0 max-w-[570px]"
      aria-label={placeholder}
    />
  )
}
