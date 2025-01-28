import type { General } from '../common'

export interface WaitWebInboundInfo {
  timeout: string
  condition: string
}

export interface WaitWebInbound {
  general: General
  info: WaitWebInboundInfo
}
