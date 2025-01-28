import { flowKeys, getCommonFlowTree } from '..'

export const useQueryCommonFlowTree = () => ({
  queryKey: [flowKeys.commonFlowTree],
  queryFn: () => getCommonFlowTree(),
})
