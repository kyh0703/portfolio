import type { General } from '../common'

export type MentType = {
  typeId: string
  desc: string
  condition: string
}

export interface ChoiceMent {
  general: General
  mentType: MentType
}
