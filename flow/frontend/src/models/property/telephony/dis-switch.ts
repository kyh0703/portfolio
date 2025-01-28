import type { General, Tracking } from '../common'

export interface DisSwitch {
  general: General
  info: { choiceCall: string }
  tracking: Tracking
}
