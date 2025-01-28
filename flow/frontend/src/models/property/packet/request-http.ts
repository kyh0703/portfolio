import type { General, Tracking } from '../common'

export type MethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'

export type ContentType = 'application/json'

export interface RequestInfo {
  name: string
  timeout: string
  choiceCall: string
  bgm: string
  condition: string
}

export interface HeaderList {
  name: string
  value: string
}

export interface BodyList {
  name: string
  value: string
}

export interface HttpData {
  url: string
  method: MethodType
  contentType: ContentType
  connTimeout: string
  respTimeout: string
  verifyCert: boolean
  headerList: HeaderList[]
  useExpression: boolean
  variable: string
  bodyList: BodyList[]
}

export interface RequestHTTP {
  general: General
  requestInfo: RequestInfo
  httpData: HttpData
  tracking: Tracking
}
