import type { General, Tracking } from '../common'

export interface OpenVRInfo {
  timeout: string
  sttName?: string
}

export interface OpenVR {
  general: General
  info: OpenVRInfo
  tracking: Tracking
}
