import { flowKeys, getSubFlowTree } from '..'

export const useQuerySubFlowTree = () => ({
  queryKey: [flowKeys.subFlowTree],
  queryFn: () => getSubFlowTree(),
})
