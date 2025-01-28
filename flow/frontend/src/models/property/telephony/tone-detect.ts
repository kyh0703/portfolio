import type { General, Tracking } from '../common'

export interface ToneDetectInfo {
  detectType: string
  choiceCall: string
  timeout: string
}

export interface ToneDetect {
  general: General
  info: ToneDetectInfo
  tracking: Tracking
}
