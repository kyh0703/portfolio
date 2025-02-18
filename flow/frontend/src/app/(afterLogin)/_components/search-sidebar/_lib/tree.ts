import {
  DefineData,
  MenuData,
  PropertyData,
} from '@/models/web-socket/search/types'

const getPropertyNodeId = (property: PropertyData) =>
  `${property.subFlowName}/${property.nodeName}/${property.path}`

const getDefineNodeId = (define: DefineData) =>
  `${define.defineType}/${define.scope}/${define.defineId}/${define.path}`

const getMenuNodeId = (menu: MenuData) =>
  `menu/${menu.menuId}/${menu.menuName}/${menu.path}`

export { getDefineNodeId, getMenuNodeId, getPropertyNodeId }
