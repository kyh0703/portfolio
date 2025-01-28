'use client'

import { useDefineStore } from '@/store/define'
import type { DefineType } from '@/types/define'
import Link from 'next/link'
import { twJoin } from 'tailwind-merge'
import { useShallow } from 'zustand/react/shallow'

export const commonItems = ['Ment', 'Packet']

export const globalItems = [
  'Var',
  'Menu',
  'Ment',
  'Packet',
  'Intent',
  'Log',
  'UserFunc',
  'CDR',
  'Track',
  'Service',
  'String',
  'MenuStat',
]

export default function DefineItems() {
  const [scope, page, setPage] = useDefineStore(
    useShallow((state) => [state.scope, state.page, state.setPage]),
  )

  return (
    <ul className="flex flex-col gap-3">
      {scope == 'common'
        ? commonItems.map((item) => {
            const lowerCaseItem = item.toLowerCase()

            return (
              <Link key={item} href={`/defines/${scope}/${lowerCaseItem}`}>
                <li
                  key={item}
                  className={twJoin(
                    'cursor-pointer rounded p-2',
                    'hover:bg-active hover:text-active-foreground',
                    page == lowerCaseItem &&
                      'bg-active font-bold text-active-foreground',
                  )}
                  onClick={() => setPage(lowerCaseItem as DefineType)}
                >
                  {item}
                </li>
              </Link>
            )
          })
        : globalItems.map((item) => {
            const lowerCaseItem = item.toLowerCase()

            return (
              <Link key={item} href={`/defines/${scope}/${lowerCaseItem}`}>
                <li
                  key={item}
                  className={twJoin(
                    'cursor-pointer rounded p-2',
                    'hover:bg-active hover:text-active-foreground',
                    page == lowerCaseItem &&
                      'bg-active font-bold text-active-foreground',
                  )}
                  onClick={() => setPage(lowerCaseItem as DefineType)}
                >
                  {item}
                </li>
              </Link>
            )
          })}
    </ul>
  )
}
