import type { General, Tracking } from '../common'
import { SwitchInfo } from '../common/switch-info'

export interface Switch {
  general: General
  info: SwitchInfo
  tracking: Tracking
}
