import type { General } from '../common'

export interface CdrCtrlInfo {
  cdrInit: boolean
  condition: string
}

export interface CdrCtrl {
  general: General
  ctrlInfo: CdrCtrlInfo
}
