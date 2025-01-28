import type { General, Tracking } from '../common'

export interface DBQueryInfo {
  reqOnly: boolean
  name: string
  timeout: string
  type: string
  transId: string
  formatEx: boolean
  queryData: string
  procName: string
  argList: string[]
  resultList: string[]
  choiceCall: string
  bgm: string
  condition: string
}

export interface DBQuery {
  general: General
  info: DBQueryInfo
  tracking: Tracking
}
