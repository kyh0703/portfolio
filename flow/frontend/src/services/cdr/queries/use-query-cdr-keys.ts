import { CdrType } from '@/constants/options'
import { getAllCdrKey } from '../api'
import { cdrKeys } from '../keys'

export const useQueryCdrKeys = (type: CdrType) => ({
  queryKey: [cdrKeys.all(type)],
  queryFn: () => getAllCdrKey(type),
})
