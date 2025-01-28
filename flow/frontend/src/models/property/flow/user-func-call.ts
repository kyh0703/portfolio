import type { General } from '../common'

export interface FuncList {
  name: string
  condition: string
}

export interface UserFuncCall {
  general: General
  funcList: FuncList[]
}
