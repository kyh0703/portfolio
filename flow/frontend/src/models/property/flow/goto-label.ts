import type { General } from '../common'

export interface GotoLabelInfo {
  tagName: string
  labelId: string
}

export interface GotoLabel {
  general: General
  info: GotoLabelInfo
}
