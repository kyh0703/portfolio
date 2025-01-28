import type { General } from '../common'

export interface AssignList {
  name: string
  expression?: string
  condition: string
}

export interface Assign {
  general: General
  assignList: AssignList[]
}
