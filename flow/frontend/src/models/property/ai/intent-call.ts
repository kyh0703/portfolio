import type { General, Tracking } from '../common'

export interface IntentList {
  id: string
  name?: string
  menuCall?: string
  subCall?: string
}

export interface IntentCallInfo {
  condition: string
  intentList: IntentList[]
  ignoreGlobalIntent: boolean
}

export interface IntentCall {
  general: General
  intentInfo: IntentCallInfo
  tracking: Tracking
}
