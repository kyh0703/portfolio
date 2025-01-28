import type { DefineData, MenuData, PropertyData } from './types'

export interface SearchProgress {
  query: string
  filters: {
    subFlowId: number
    nodeKind?: string
    propertyName?: string
    useMatchWholeWord: boolean
    useMatchCase: boolean
  }
  status: 'inprogress'
  progress: number
  results: {
    properties: PropertyData[]
    defines: DefineData[]
    menus: MenuData[]
  }
}
