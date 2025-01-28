import { flowKeys, getCommonFlows } from '..'

export const useQueryCommonFlows = () => ({
  queryKey: [flowKeys.commonFlows],
  queryFn: () => getCommonFlows(),
})
