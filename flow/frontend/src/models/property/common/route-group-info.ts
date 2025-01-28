export interface RouteGroupList {
  groupId: string
  routeType?: string
  bsrRoute?: string
  priority: string
}

export interface RouteGroupInfo {
  routeList: RouteGroupList[]
  priority: string
  timeout: string
  bgm: string
  condition: string
}
