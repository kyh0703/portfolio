import { getNodes, subFlowKeys } from '..'

export const useQueryNodes = (subFlowId: number) => ({
  queryKey: [subFlowKeys.nodeList(subFlowId)],
  queryFn: () => getNodes(subFlowId),
})
