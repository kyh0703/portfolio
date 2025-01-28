import type { General, RecognizeInfo, Tracking } from '../common'

export interface EntityCallInfo {
  name: string
  intentId: string
  intentName: string
  endMethod: string
  ignoreGlobalIntent: boolean
  condition: string
  nluInfo: {
    transId: string
    modelName: string
    threshold: string
    timeout: string
  }
}

export interface EntityCall {
  general: General
  entityInfo: EntityCallInfo
  recognizeInfo: RecognizeInfo
  tracking: Tracking
}
