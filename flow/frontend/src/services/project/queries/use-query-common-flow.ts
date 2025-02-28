import { flowKeys, getCommonFlow } from '..'

export const useQueryCommonFlow = (commonFlowId: number) => ({
  queryKey: [flowKeys.commonFlowDetail(commonFlowId)],
  queryFn: () => getCommonFlow(commonFlowId),
})
