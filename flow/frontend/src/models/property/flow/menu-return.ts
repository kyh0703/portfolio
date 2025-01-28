import { General } from '../common'

export interface MenuReturnInfo {
  type: string
  returnType: string
  useExpression: boolean
  menuId: string
}

export interface MenuReturn {
  general: General
  info: MenuReturnInfo
}
