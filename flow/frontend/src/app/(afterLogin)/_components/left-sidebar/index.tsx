'use client'

import Spinner from '@/app/_components/spinner'
import { useLayoutStore } from '@/store/layout'
import { Suspense } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { leftSidebarComponents } from './types'

export default function LeftSideBar() {
  const [nav, hasLeftSidebar] = useLayoutStore(
    useShallow((state) => [state.nav, state.leftSidebar.open]),
  )

  if (!hasLeftSidebar) {
    return null
  }

  const SidebarComponent = leftSidebarComponents[nav]
  if (!SidebarComponent) {
    return null
  }

  return (
    <Suspense fallback={<Spinner />}>
      <SidebarComponent />
    </Suspense>
  )
}
