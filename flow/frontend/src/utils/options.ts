import { SubFlowList } from '@/models/subflow-list'
import type { DefineList } from '@/types/define'

function removeDuplicateDefines<T>(
  defineList: DefineList<T>[],
): DefineList<T>[] {
  const seen = new Set()
  return defineList.filter((define) => {
    if (seen.has(define.defineId)) {
      return false
    }
    seen.add(define.defineId)
    return true
  })
}

function removeDuplicateMenus(menuList: MenuList[]): MenuList[] {
  const seen = new Set()
  return menuList.filter((menu) => {
    if (seen.has(menu.property.id)) {
      return false
    }
    seen.add(menu.property.id)
    return true
  })
}

function removeMainOrEndFlows(flows: SubFlowList[]) {
  return flows.filter(
    (flow) => !['main', 'end'].includes(flow.name.toLowerCase()),
  )
}

export { removeDuplicateDefines, removeDuplicateMenus, removeMainOrEndFlows }
