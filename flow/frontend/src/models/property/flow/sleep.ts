import type { General } from '../common'

export interface TimeInfo {
  sleepTime: string
  kind: string
  condition: string
}

export interface Sleep {
  general: General
  timeInfo: TimeInfo
}
