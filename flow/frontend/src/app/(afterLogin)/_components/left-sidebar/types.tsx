'use client'

import CommandSidebar from '../command-sidebar'
import ConfigSidebar from '../config-sidebar'
import DefineSidebar from '../define-sidebar'
import HelpSidebar from '../help-sidebar'
import SearchSidebar from '../search-sidebar'
import SubFlowSidebar from '../subflow-sidebar'

export const leftSidebarComponents = {
  list: SubFlowSidebar,
  component: CommandSidebar,
  search: SearchSidebar,
  defines: DefineSidebar,
  configs: ConfigSidebar,
  // help: HelpSidebar,
}

export type LeftSidebarComponentKey = keyof typeof leftSidebarComponents
