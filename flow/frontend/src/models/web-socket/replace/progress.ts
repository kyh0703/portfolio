import type {
  DefineData,
  MenuData,
  PropertyData,
} from '@/models/web-socket/search/types'

export interface ReplaceProgress {
  query: string
  replace: string
  status: string
  progress: number
  results: {
    properties: PropertyData[]
    defines: DefineData[]
    menus: MenuData[]
  }
}
