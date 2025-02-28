'use client'

import { InputSearchIcon } from '@/app/_components/icon'
import { Input } from '@/ui/input'
import { cn } from '@/utils/cn'

type SearchBoxProps = {
  placeHolder?: string
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SearchBox({
  placeHolder,
  disabled,
  onChange,
}: SearchBoxProps) {
  return (
    <div className="flex w-full items-center justify-end rounded border border-search-border bg-search">
      <div className="ml-3">
        <InputSearchIcon />
      </div>
      <Input
        className={cn(
          'rounded-sm border-none bg-inherit leading-6 outline-none',
          'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
        )}
        type="search"
        placeholder={placeHolder}
        disabled={disabled}
        onChange={disabled ? undefined : onChange}
      />
    </div>
  )
}
