import type { FlowType } from '@/models/flow'
import type { ComponentItem } from './types'

export const filterComponent = (
  item: ComponentItem,
  options?: {
    subFlowName?: string
    flowType?: FlowType
  },
) => {
  let isValid = true
  if (!options) {
    return isValid
  }

  switch (options.flowType) {
    case 'ivr':
      isValid &&= item.flowType === 'ivr' || item.flowType === 'all'
      break
    case 'route':
      isValid &&= item.flowType === 'route' || item.flowType === 'all'
      break
  }

  switch (options.subFlowName) {
    case 'end':
      isValid &&= !!!item.isNotInEnd
      break
    default:
      break
  }

  return isValid
}
