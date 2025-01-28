import type { General, Tracking } from '../common'

export interface RecordInfo {
  fileName: string
  filePath: string
  choiceCall: string
  background: boolean
  asr: boolean
  twoWay: boolean
  mode: string
  beep: boolean
  noVoice: string
  maxTime: string
  maxSilence: string
  termKey: string
  ment: string
  condition: string
}

export interface Record {
  general: General
  info: RecordInfo
  tracking: Tracking
}
