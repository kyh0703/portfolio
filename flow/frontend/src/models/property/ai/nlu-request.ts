import type {
  ChatInfo,
  General,
  MentInfo,
  RecognizeInfo,
  Tracking,
} from '../common'

export interface NLURequestInfo {
  name: string
  transId: string
  modelName: string
  threshold: string
  retry: string
  timeout: string
  endMethod: string
  tracking: boolean
  setIntent: boolean
  intentId: string
  intentName: string
  condition: string
  setIntentValue: boolean
  intentValue: string
}

export interface NLURequest {
  general: General
  nluInfo: NLURequestInfo
  recognizeInfo: RecognizeInfo
  ment: MentInfo
  chat: ChatInfo
  tracking: Tracking
}
