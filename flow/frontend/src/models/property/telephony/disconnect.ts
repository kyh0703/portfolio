import type { General, Tracking } from '../common'

export interface DisconnectInfo {
  type: string
  choiceCall: string
}

export interface Disconnect {
  general: General
  info: DisconnectInfo
  tracking: Tracking
}
