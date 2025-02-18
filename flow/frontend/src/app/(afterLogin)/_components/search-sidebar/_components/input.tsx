'use client'

import { Button } from '@/app/_components/button'
import { Input } from '@/app/_components/input'
import { useUserContext } from '@/store/context'
import { useSearchStore } from '@/store/search'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ReplaceAllIcon,
  SearchIcon,
} from 'lucide-react'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { filterDefineItem } from '../../define-sidebar/filter'
import { defineItems } from '../../define-sidebar/types'

type SearchInputProps = {
  disable: boolean
  treeDataLength: number
  onSubmit?: () => void
  onReplaceAll?: () => void
}

export default function SearchInput({
  disable,
  treeDataLength,
  onSubmit,
  onReplaceAll,
}: SearchInputProps) {
  const { type: flowType, mode: flowMode } = useUserContext()
  const [options, setSearch, setReplace, toggleIsOpenReplace] = useSearchStore(
    useShallow((state) => [
      state.options,
      state.setSearch,
      state.setReplace,
      state.toggleIsOpenReplace,
    ]),
  )

  const filteredDefineItems = useMemo(
    () => [
      ...new Set(
        defineItems
          .filter((item) =>
            filterDefineItem(item, {
              flowType,
              flowMode,
            }),
          )
          .map((item) => item.name),
      ),
    ],
    [flowMode, flowType],
  )

  const disableSearch = useMemo(
    () =>
      disable ||
      (!options.search && !options.nodeKind && !options.propertyName) ||
      (filteredDefineItems.includes(options.nodeKind) && !options.search),
    [
      disable,
      filteredDefineItems,
      options.nodeKind,
      options.propertyName,
      options.search,
    ],
  )

  const disableReplace = useMemo(
    () =>
      disable || !options.search || !options.replace || treeDataLength === 0,
    [disable, options, treeDataLength],
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
        {options.isOpenReplace ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </Button>
      <div className="space-y-1">
        <div className="flex grow overflow-hidden rounded-md border border-input bg-background ring-offset-background">
          <Input
            className="h-7 shrink grow border-none"
            value={options.search}
            placeholder="Search"
            disabled={disable}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !disableSearch) {
                onSubmit?.()
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
        {options.isOpenReplace && (
          <div className="flex grow overflow-hidden rounded-md border border-input bg-background ring-offset-background">
            <Input
              className="h-7 shrink grow border-none"
              value={options.replace}
              placeholder="Replace"
              disabled={disable}
              onChange={(e) => setReplace(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !disableReplace) {
                  onReplaceAll?.()
                }
              }}
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
