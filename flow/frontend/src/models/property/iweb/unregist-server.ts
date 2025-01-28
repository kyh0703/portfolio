import type { General, Tracking } from '../common'

export interface UnregistServerInfo {
  transId: string
  condition: string
}

export interface UnregistServer {
  general: General
  info: UnregistServerInfo
  tracking: Tracking
}
