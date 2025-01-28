import { General, Tracking } from '../common'

export interface MenuCallInfo {
  useExpression: boolean
  menuId: string
  condition: string
}

export type BranchList = {
  branchType?: string
  comCondition?: string
  name: string
  useExpression?: boolean
  menuId: string
  condition: string
}

export interface ExpandMenuInfo {
  expand: boolean
  condExpression: string
  branchList: BranchList[]
}

export interface MenuCall {
  general: General
  menuInfo: MenuCallInfo
  expandMenuInfo: ExpandMenuInfo
  tracking: Tracking
}
