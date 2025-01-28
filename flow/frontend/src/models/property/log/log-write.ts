import type { General } from '../common'

export interface LogWriteInfo {
  isSleeLog: boolean
  id: string
  path: string
  formatEx: boolean
  expression: string
  condition: string
}

export interface LogWrite {
  general: General
  info: LogWriteInfo
}
