export interface RouteList {
  skillId: string
  skillLevel: string
  routeType: string
  bsrRoute: string
  priority: string
}

export interface RouteInfo {
  routeList: RouteList[]
  priority: string
  timeout: string
  bgm: string
  condition: string
}
