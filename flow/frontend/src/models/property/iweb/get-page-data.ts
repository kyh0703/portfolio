import type { General, Tracking } from '../common'

export interface ObjectList {
  id: string
  variable: string
}

export interface ObjectInfo {
  name: string
  transId: string
  reqPage: string
  pageName: string
  objectList: ObjectList[]
  useTimeout: boolean
  timeout: string
  endMethod: string
  condition: string
}

export interface ExceptionInfo {
  downMethod: string
  changeService: {
    service: string
    ani: string
    dnis: string
    usrData: string
  }
  guideMent: string
}

export interface GetPageData {
  general: General
  objectInfo: ObjectInfo
  exceptionInfo: ExceptionInfo
  tracking: Tracking
}
