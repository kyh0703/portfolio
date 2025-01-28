import type { General } from '../common'

export interface GotoList {
  nodeId: string
  tagName: string
}

export interface LabelInfo {
  labelName: string
  gotoList: GotoList[]
}

export interface SetLabel {
  general: General
  labelInfo: LabelInfo
}
