import { flowKeys, getFlow } from '..'

export const useQueryFlow = (flowId: number) => ({
  queryKey: [flowKeys.detail(flowId)],
  queryFn: () => getFlow(flowId),
})
