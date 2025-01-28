import type { MediaType } from '@/constants/options'
import type { General, Tracking } from '../common'

export interface AbortInfo {
  lineNo: string
  mediaType: MediaType
  choiceCall: string
}

export interface Abort {
  general: General
  info: AbortInfo
  tracking: Tracking
}
