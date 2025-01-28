import type { General } from '../common'

export interface InboundInfo {
  ani: string
  dnis: string
  usrData: string
  trkData: string
  ringTime: number
  cdrInit: boolean
}

export interface WaitInbound {
  general: General
  inboundInfo: InboundInfo
}
