import type { DefineType } from '@/types/define'

export type SearchTreeData = {
  id: string
  name: string
  children?: SearchTreeData[]
} & (PropertyData | DefineData | MenuData)

type CommonData = {
  itemType: 'property' | 'define' | 'menu'
  origin: string
  replace?: string
  path: string
}

export type PropertyData = {
  subFlowId: number
  subFlowName: string
  nodeId: number
  nodeName: string
  nodeKind: string
} & CommonData

export type MenuData = {
  rootId: number
  menuId: number
  menuName: string
} & CommonData

export type DefineData = {
  scope: 'global' | 'common'
  defineType: DefineType
  defineId: number
  defineName: string
} & CommonData
