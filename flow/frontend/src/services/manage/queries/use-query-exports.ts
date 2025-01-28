import { getExports, manageKeys } from '..'

export const useQueryExports = () => ({
  queryKey: [manageKeys.exports],
  queryFn: () => getExports(),
})
