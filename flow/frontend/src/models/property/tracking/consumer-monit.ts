import type { General } from '../common'

export interface ConsumerMonitInfo {
  easyCheck: boolean
  type: string
  level: string
  condition: string
}

export interface ConsumerMonit {
  general: General
  info: ConsumerMonitInfo
}
