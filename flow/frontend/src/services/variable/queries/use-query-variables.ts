import { getVariables, variableKeys } from '..'

export const useQueryVariables = (subFlowId: number) => ({
  queryKey: [variableKeys.all],
  queryFn: () => getVariables(subFlowId),
})
