import type { General } from '../common'

export interface RouteQueueInfo {
  priority: string
  timeout: string
}

export interface RouteQueueRule {
  general: General
  routeInfo: RouteQueueInfo
}
