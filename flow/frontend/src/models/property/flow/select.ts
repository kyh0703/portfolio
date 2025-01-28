import type { General } from '../common'

export interface Link {
  condition: string
  target: string
}

export interface SelectLink {
  condition: string
  link: Link[]
}

export interface Select {
  general: General
  select: SelectLink
}
