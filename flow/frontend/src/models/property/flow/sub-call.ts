import type { General, ArgumentInfo } from '../common'

export interface SubCallInfo {
  name: string
  subFlowName: string
  in: ArgumentInfo
  out: ArgumentInfo
}

export interface SubCall {
  general: General
  info: SubCallInfo
}
