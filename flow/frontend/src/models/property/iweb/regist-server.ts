import type { General, Tracking } from '../common'

export interface RegistServerInfo {
  transId: string
  condition: string
}

export interface RegistServer {
  general: General
  info: RegistServerInfo
  tracking: Tracking
}
