import { defineKeys, getDefine } from '..'

export const useQueryDefine = <T>(defineId: number) => ({
  queryKey: [defineKeys.detail(defineId)],
  queryFn: () => getDefine<T>(defineId),
})
