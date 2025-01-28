import type { DefineType } from '@/types/define'
import { getAllDefine } from '..'
import { defineKeys } from '../keys'

export const useQueryDefines = <T>(type: DefineType) => ({
  queryKey: [defineKeys.all(type)],
  queryFn: () => getAllDefine<T>(type),
})
