import { defineKeys, getDefineByStringId } from '..'

export const useQueryDefineByStringId = <T>(defineId: string) => ({
  queryKey: [defineKeys.detailByString(defineId)],
  queryFn: () => getDefineByStringId<T>(defineId),
})
