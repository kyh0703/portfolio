import type { General } from '../common'

export interface DisconnectWebInfo {
  transId: string
  condition: string
}

export interface DisconnectWeb {
  general: General
  info: DisconnectWebInfo
}
