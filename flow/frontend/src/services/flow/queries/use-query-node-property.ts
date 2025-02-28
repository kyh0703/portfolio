import { getNodeProperty, subFlowKeys } from '..'

export const useQueryNodeProperty = <T>(nodeId: number) => ({
  queryKey: [subFlowKeys.nodeProperty(nodeId)],
  queryFn: () => getNodeProperty<T>(nodeId),
})
