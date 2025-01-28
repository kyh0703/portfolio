import { flowKeys, getSubFlow } from '..'

export const useQuerySubFlow = (subFlowId: number) => ({
  queryKey: [flowKeys.subFlowDetail(subFlowId)],
  queryFn: () => getSubFlow(subFlowId),
})
