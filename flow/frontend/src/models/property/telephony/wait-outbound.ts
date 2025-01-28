import type { General } from '../common'

export interface OutboundInfo {
  usrData: string
  callLine: string
  dnGroup: string
  cdrInit: boolean
}

export interface WaitOutbound {
  general: General
  outboundInfo: OutboundInfo
}
