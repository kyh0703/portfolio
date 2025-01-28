'use client'

import { useContextStore } from '@/store/context'
import { useShallow } from 'zustand/react/shallow'

export default function Title() {
  const [name, version] = useContextStore(
    useShallow((state) => [state.ctx?.name, state.ctx?.version]),
  )

  return (
    <nav>
      {name} {version}
    </nav>
  )
}
