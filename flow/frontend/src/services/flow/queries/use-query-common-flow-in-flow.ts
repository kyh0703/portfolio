import { flowKeys, getCommonFlowIn } from '..'

export const useQueryCommonFlowInFlow = () => ({
  queryKey: [flowKeys.commonInFlows],
  queryFn: () => getCommonFlowIn(),
})
