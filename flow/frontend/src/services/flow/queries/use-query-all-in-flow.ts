import { flowKeys, getInFlows } from '..'

export const useQueryAllInFlow = () => ({
  queryKey: [flowKeys.inFlows],
  queryFn: () => getInFlows(),
})
