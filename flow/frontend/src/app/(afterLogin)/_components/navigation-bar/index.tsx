'use client'

import {
  ComponentsIcon,
  ConfigsIcon,
  DefinesIcon,
  FlowsIcon,
  HelperIcon,
  LogoIcon,
  SearchIcon,
} from '@/app/_components/icon'
import { useUserContext } from '@/store/context'
import { useDefineStore } from '@/store/define'
import { useCurrentTab } from '@/store/flow-tab'
import { useLayoutStore, type NavigationItem } from '@/store/layout'
import { useManagementStore } from '@/store/management'
import Link from 'next/link'
import { MouseEvent, useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { useShallow } from 'zustand/react/shallow'

const getIconWrapperClasses = (hasFocus: boolean) =>
  twJoin(' p-5', hasFocus ? 'bg-left-tool-focus' : 'bg-left-tool')

export default function NavigationBar() {
  const { id: flowId } = useUserContext()
  const currentTab = useCurrentTab(flowId)
  const [nav, setNav, hasLeftSidebar, toggleLeftSidebar] = useLayoutStore(
    useShallow((state) => [
      state.nav,
      state.setNav,
      state.leftSidebar.open,
      state.toggleLeftSidebar,
    ]),
  )
  const subFlow = currentTab.subFlows[currentTab.index]
  const [defineScope, definePage] = useDefineStore(
    useShallow((state) => [state.scope, state.page]),
  )
  const configPage = useManagementStore(useShallow((state) => state.page))
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
          <LogoIcon width={32} height={32} color="#fff" />
        </div>
        <Link
          className="w-full"
          href={`/subflows/${subFlow?.id!}`}
          onClick={(event) => handleClick(event, 'list')}
        >
          <div className={getIconWrapperClasses(nav === 'list')}>
            <FlowsIcon width={32} height={32} color="#fff" cursor="pointer" />
          </div>
        </Link>
        <Link
          className="w-full"
          href={`/subflows/${subFlow?.id!}`}
          onClick={(event) => handleClick(event, 'component')}
        >
          <div className={getIconWrapperClasses(nav === 'component')}>
            <ComponentsIcon
              width={32}
              height={32}
              color="#fff"
              cursor="pointer"
            />
          </div>
        </Link>
        <Link
          className="w-full"
          href={`/subflows/${subFlow?.id!}`}
          onClick={(event) => handleClick(event, 'search')}
        >
          <div className={getIconWrapperClasses(nav === 'search')}>
            <SearchIcon width={32} height={32} color="#fff" cursor="pointer" />
          </div>
        </Link>
        <Link
          className="w-full"
          href={`/defines/${defineScope}/${definePage}`}
          onClick={(event) => handleClick(event, 'defines')}
        >
          <div className={getIconWrapperClasses(nav === 'defines')}>
            <DefinesIcon width={32} height={32} color="#fff" cursor="pointer" />
          </div>
        </Link>
        <Link className="w-full" href={`/managements/${configPage}`}>
          <div
            className={getIconWrapperClasses(nav === 'configs')}
            onClick={(event) => handleClick(event, 'configs')}
          >
            <ConfigsIcon width={32} height={32} color="#fff" cursor="pointer" />
          </div>
        </Link>
        {/* <Link
          className="w-full"
          href="/help"
          onClick={(event) => handleClick(event, 'help')}
        >
          <div className={getIconWrapperClasses(nav === 'help')}>
            <HelperIcon width={32} height={32} color="#fff" cursor="pointer" />
          </div>
        </Link> */}
      </div>
    </nav>
  )
}
