import type { General, Tracking } from '../common'

export interface EnvData {
  name: string
  file: string
  service: string
  value: string
  default: string
  write: boolean
  condition: string
}

export interface UserEnv {
  general: General
  envData: EnvData
  tracking: Tracking
}
