import type { General } from '../common'

export interface CdrCallInfo {
  name: string
  argList: string[]
  condition: string
}

export interface CdrCall {
  general: General
  procInfo: CdrCallInfo
}
