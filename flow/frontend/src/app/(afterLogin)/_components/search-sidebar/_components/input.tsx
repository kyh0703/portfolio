'use client'

import { Button } from '@/app/_components/button'
import { Input } from '@/app/_components/input'
import { useSearchStore } from '@/store/search'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ReplaceAllIcon,
  SearchIcon,
} from 'lucide-react'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { globalItems as defines } from '../../define-sidebar/items'

type SearchInputProps = {
  disable: boolean
  onSubmit?: () => void
  onReplaceAll?: () => void
}

export default function SearchInput({
  disable,
  onSubmit,
  onReplaceAll,
}: SearchInputProps) {
  const [
    data,
    search,
    replace,
    nodeKind,
    propertyName,
    isOpenReplace,
    setSearch,
    setReplace,
    toggleIsOpenReplace,
  ] = useSearchStore(
    useShallow((state) => [
      state.data,
      state.search,
      state.replace,
      state.nodeKind,
      state.propertyName,
      state.isOpenReplace,
      state.setSearch,
      state.setReplace,
      state.toggleIsOpenReplace,
    ]),
  )

  const disableSearch = useMemo(
    () =>
      disable ||
      (!search && !nodeKind && !propertyName) ||
      (defines.includes(nodeKind) && !search),
    [disable, nodeKind, propertyName, search],
  )

  const disableReplace = useMemo(
    () => disable || !search || !replace || data.length === 0,
    [data.length, disable, replace, search],
  )

  return (
    <div className="grid grid-cols-[auto_1fr] gap-1 px-2">
      <Button
        className="h-full w-5 rounded-md"
        variant="ghost"
        size="icon"
        disabled={disable}
        onClick={toggleIsOpenReplace}
      >
        {isOpenReplace ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </Button>
      <div className="space-y-1">
        <div className="flex grow overflow-hidden rounded-md border border-input bg-background ring-offset-background">
          <Input
            className="h-7 shrink grow border-none"
            value={search}
            placeholder="Search"
            disabled={disable}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSubmit && onSubmit()
              }
            }}
          />
          <Button
            className="text-sx h-7 w-7 rounded-none bg-main p-1.5 hover:bg-input active:bg-input"
            variant="ghost"
            size="icon"
            disabled={disableSearch}
            onClick={onSubmit}
          >
            <SearchIcon />
          </Button>
        </div>
        {isOpenReplace && (
          <div className="flex grow overflow-hidden rounded-md border border-input bg-background ring-offset-background">
            <Input
              className="h-7 shrink grow border-none"
              value={replace}
              placeholder="Replace"
              disabled={disable}
              onChange={(e) => setReplace(e.target.value)}
            />
            <Button
              className="text-sx h-7 w-7 rounded-none bg-main p-1.5 hover:bg-input active:bg-input"
              variant="ghost"
              size="icon"
              disabled={disableReplace}
              onClick={onReplaceAll}
            >
              <ReplaceAllIcon />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
