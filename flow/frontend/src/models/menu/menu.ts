import type { IdObj } from 'react-arborist/dist/module/types/utils'
import type { DefineMenu } from '../define'

export interface MenuTree {
  id: number
  name: string
  uuid: string
  children?: MenuTree[]
}

export interface MenuTreeData extends IdObj {
  name: string
  databaseId: number
  isCreated?: boolean
  children?: MenuTreeData[]
}

export interface MenuClipboard {
  menuId: number
  menuData: DefineMenu
}

export interface Menu {
  flowId: number
  id: number
  menuId: string
  parentId: number
  menuTree: MenuTree[]
  value: DefineMenu
  updateDate: Date
}
