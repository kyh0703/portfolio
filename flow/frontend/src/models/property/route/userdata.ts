import type { General } from '../common'

export interface UserDataInfo {
  name: string
  key: string
  value: string
  default: string
  update: boolean
  condition: string
}

export interface UserData {
  general: General
  userInfo: UserDataInfo
}
