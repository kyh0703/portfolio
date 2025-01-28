import type { General, Tracking } from '../common'

export interface JsonData {
  key: string
  value?: string
}

export interface PacketJsonInfo {
  requestOnly: boolean
  name: string
  transId: string
  timeout: string
  choiceCall: string
  bgm: string
  condition: string
}

export interface PacketJson {
  general: General
  packetInfo: PacketJsonInfo
  jsonData: JsonData[]
  tracking: Tracking
}
