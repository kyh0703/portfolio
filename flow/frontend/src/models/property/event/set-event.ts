import type { General, Tracking } from '../common'

export interface SetEventInfo {
  to: string
  eventId: string
  data: string
}

export interface SetEvent {
  general: General
  info: SetEventInfo
  tracking: Tracking
}
