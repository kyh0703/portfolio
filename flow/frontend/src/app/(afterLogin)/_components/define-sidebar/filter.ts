import type { FlowMode, FlowType } from '@/models/flow'
import type { DefineItem } from './types'

export const filterDefineItem = (
  item: DefineItem,
  options?: {
    flowType?: FlowType
    flowMode?: FlowMode
  },
) => {
  if (!options) {
    return true
  }

  if (options.flowType === 'route' && !item.supportRoute) {
    return false
  }

  if (options.flowMode === 'beginner' && !item.supportBeginner) {
    return false
  }

  return true
}
