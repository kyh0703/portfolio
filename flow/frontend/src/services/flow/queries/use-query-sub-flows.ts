import { flowKeys, getSubFlows } from '..'

export const useQuerySubFlows = () => ({
  queryKey: [flowKeys.subFlows],
  queryFn: () => getSubFlows(),
})
