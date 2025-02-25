'use client'

import ComponentSidebar from '../component-sidebar'
import ConfigSidebar from '../config-sidebar'
import DefineSidebar from '../define-sidebar'
import OutlineSidebar from '../outline-sidebar'
import SearchSidebar from '../search-sidebar'
import SubFlowSidebar from '../subflow-sidebar'

export const leftSidebarComponents = {
  list: SubFlowSidebar,
  component: ComponentSidebar,
  outline: OutlineSidebar,
  search: SearchSidebar,
  defines: DefineSidebar,
  configs: ConfigSidebar,
}

export type LeftSidebarComponentKey = keyof typeof leftSidebarComponents
