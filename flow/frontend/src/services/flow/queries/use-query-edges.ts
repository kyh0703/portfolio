import { getEdges, subFlowKeys } from '..'

export const useQueryEdges = (subFlowId: number) => ({
  queryKey: [subFlowKeys.edgeList(subFlowId)],
  queryFn: () => getEdges(subFlowId),
})
