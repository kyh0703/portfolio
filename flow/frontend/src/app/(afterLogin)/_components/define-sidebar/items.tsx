'use client'

import { useUserContext } from '@/store/context'
import { useDefineStore } from '@/store/define'
import type { DefineType } from '@/types/define'
import Link from 'next/link'
import { useMemo } from 'react'
import { twJoin } from 'tailwind-merge'
import { useShallow } from 'zustand/react/shallow'
import { filterDefineItem } from './filter'
import { defineItems } from './types'

export default function DefineItems() {
  const { type: flowType, mode: flowMode } = useUserContext()
  const [scope, page, setPage] = useDefineStore(
    useShallow((state) => [state.scope, state.page, state.setPage]),
  )

  const filteredDefineItems = useMemo(
    () =>
      defineItems.filter(
        (item) =>
          item.scope == scope && filterDefineItem(item, { flowType, flowMode }),
      ),
    [flowMode, flowType, scope],
  )

  return (
    <ul className="flex flex-col gap-3">
      {filteredDefineItems.map((item) => {
        const name = item.name.toLowerCase()

        return (
          <Link key={name} href={`/defines/${scope}/${name}`}>
            <li
              key={name}
              className={twJoin(
                'cursor-pointer rounded p-2',
                'hover:bg-active hover:text-active-foreground',
                page == name && 'bg-active font-bold text-active-foreground',
              )}
              onClick={() => setPage(name as DefineType)}
            >
              {name}
            </li>
          </Link>
        )
      })}
    </ul>
  )
}
