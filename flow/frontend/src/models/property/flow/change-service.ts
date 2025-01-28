import type { General, Tracking } from '../common'

export interface ChangeServiceInfo {
  service: string
  ani: string
  dnis: string
  usrData: string
  condition: string
}

export interface ChangeService {
  general: General
  info: ChangeServiceInfo
  tracking: Tracking
}
