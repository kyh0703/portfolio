import type { General, Tracking } from '../common'

export interface PushToneInfo {
  toneString: string
  interDelay: string
  choiceCall: string
  condition: string
}

export interface PushTone {
  general: General
  info: PushToneInfo
  tracking: Tracking
}
