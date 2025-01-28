import type { General, Tracking } from '../common'

export interface ParamList {
  objectId: string
  value?: string
  type?: string
}

export interface RequestPageInfo {
  name: string
  transId: string
  fileName: string
  realName: string
  bargeIn: boolean
  paramList: ParamList[]
  inputObjectList: string[]
  condition: string
}

export interface RequestPage {
  general: General
  info: RequestPageInfo
  tracking: Tracking
}
