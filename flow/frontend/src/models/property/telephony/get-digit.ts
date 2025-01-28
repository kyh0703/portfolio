import type {
  ChatInfo,
  DigitInfo,
  General,
  MentInfo,
  RecognizeInfo,
  Tracking,
  VisualARSInfo,
} from '../common'

export interface RecognizeActInfo {
  enable: boolean
  envID: string
  prevSubCall: string
  nextSubCall: {
    scnName: string
    confidence: {
      high: string
      low: string
    }
  }
}

export interface GetDigit {
  general: General
  ment: MentInfo
  digit: DigitInfo
  chat: ChatInfo
  recognizeInfo: RecognizeInfo
  vrAct: RecognizeActInfo
  vars: VisualARSInfo
  tracking: Tracking
}
