import type { General } from '../common'

export interface RouteACDInfo {
  kind: string
  target: string
  routeType: string
  priority: string
  timeout: string
}

export interface RouteACD {
  general: General
  routeInfo: RouteACDInfo
}
