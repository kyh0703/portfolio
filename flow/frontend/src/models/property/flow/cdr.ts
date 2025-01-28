import type { CdrType } from '@/constants/options'
import type { General } from '../common'

export interface CdrDataList {
  name: string
  type: CdrType
  expression: string
  condition: string
}

export interface Cdr {
  general: General
  dataList: CdrDataList[]
}
