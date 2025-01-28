import type { General, Tracking } from '../common'

export interface WaitEventInfo {
  eventId: string
  data: string
  timeout: string
  bgm: string
}

export interface WaitEvent {
  general: General
  info: WaitEventInfo
  tracking: Tracking
}
