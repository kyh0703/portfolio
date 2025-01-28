import type { General } from '../common'

export interface CatList {
  id: string
  valueList: string[]
  condition: string
  name?: string
}

export interface UserMenuStatInfo {
  catList: CatList[]
}

export interface UserMenuStat {
  general: General
  info: UserMenuStatInfo
}
