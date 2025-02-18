'use client'

import {
  ComponentsIcon,
  ConfigsIcon,
  DefinesIcon,
  FlowsIcon,
  LogoIcon,
  SearchIcon,
} from '@/app/_components/icon'
import { useUserContext } from '@/store/context'
import { useDefineStore } from '@/store/define'
import { useFlowTabStore } from '@/store/flow-tab'
import { useLayoutStore, type NavigationItem } from '@/store/layout'
import { useManagementStore } from '@/store/management'
import Link from 'next/link'
import { MouseEvent, useMemo, useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { useShallow } from 'zustand/react/shallow'

const getIconWrapperClasses = (hasFocus: boolean) =>
  twJoin(' p-5', hasFocus ? 'bg-left-tool-focus' : 'bg-left-tool')

export default function NavigationBar() {
  const { id: flowId } = useUserContext()
  const [nav, setNav, hasLeftSidebar, toggleLeftSidebar] = useLayoutStore(
    useShallow((state) => [
      state.nav,
      state.setNav,
      state.leftSidebar.open,
      state.toggleLeftSidebar,
    ]),
  )
  const [defineScope, definePage] = useDefineStore(
    useShallow((state) => [state.scope, state.page]),
  )
  const configPage = useManagementStore(useShallow((state) => state.page))
  const currentTab = useFlowTabStore(useShallow((state) => state.tabs[flowId]))
  const subFlow = useMemo(
    () => currentTab?.subFlows[currentTab?.index] ?? null,
    [currentTab],
  )

  const [beforeNav, setBeforeNav] = useState<NavigationItem>(nav)

  const handleClick = (event: MouseEvent, nav: NavigationItem) => {
    setNav(nav)
    if (!hasLeftSidebar) {
      toggleLeftSidebar()
    } else if (beforeNav === nav) {
      toggleLeftSidebar()
    }
    setBeforeNav(nav)
  }

  return (
    <nav className="flex h-dvh w-left-nav flex-col items-start bg-left-tool">
      <div className="flex w-full flex-col items-start">
        <div className="flex w-full flex-col items-start gap-[10px] p-[20px]">
          <LogoIcon size={32} color="#fff" />
        </div>
        <Link
          className="w-full"
          href={subFlow ? `/subflows/${subFlow.id}` : '/subflows'}
          onClick={(event) => handleClick(event, 'list')}
        >
          <div className={getIconWrapperClasses(nav === 'list')}>
            <FlowsIcon size={32} color="#fff" cursor="pointer" />
          </div>
        </Link>
        <Link
          className="w-full"
          href={subFlow ? `/subflows/${subFlow.id}` : '/subflows'}
          onClick={(event) => handleClick(event, 'component')}
        >
          <div className={getIconWrapperClasses(nav === 'component')}>
            <ComponentsIcon size={32} color="#fff" cursor="pointer" />
          </div>
        </Link>
        <Link
          className="w-full"
          href={subFlow ? `/subflows/${subFlow.id}` : '/subflows'}
          onClick={(event) => handleClick(event, 'search')}
        >
          <div className={getIconWrapperClasses(nav === 'search')}>
            <SearchIcon size={32} color="#fff" cursor="pointer" />
          </div>
        </Link>
        <Link
          className="w-full"
          href={`/defines/${defineScope}/${definePage}`}
          onClick={(event) => handleClick(event, 'defines')}
        >
          <div className={getIconWrapperClasses(nav === 'defines')}>
            <DefinesIcon size={32} color="#fff" cursor="pointer" />
          </div>
        </Link>
        <Link className="w-full" href={`/managements/${configPage}`}>
          <div
            className={getIconWrapperClasses(nav === 'configs')}
            onClick={(event) => handleClick(event, 'configs')}
          >
            <ConfigsIcon size={32} color="#fff" cursor="pointer" />
          </div>
        </Link>
      </div>
    </nav>
  )
}
