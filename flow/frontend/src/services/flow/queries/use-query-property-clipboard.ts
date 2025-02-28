import { getNodePropertyClipboard, subFlowKeys } from '..'

export const useQueryPropertyClipboard = (ip: string) => ({
  queryKey: [subFlowKeys.propertyClipboard(ip)],
  queryFn: () => getNodePropertyClipboard(ip),
})
