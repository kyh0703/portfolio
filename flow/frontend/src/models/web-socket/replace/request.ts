import type {
  PropertyData,
  DefineData,
  MenuData,
} from '@/models/web-socket/search/types'

export interface ReplaceRequest {
  query: string
  replace: string
  target: {
    properties: PropertyData[]
    defines: DefineData[]
    menus: MenuData[]
  }
}
