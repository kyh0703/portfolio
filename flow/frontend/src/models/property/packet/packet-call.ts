import type { General, Tracking } from '../common'

export interface PacketData {
  name: string
  len: string
  expression: string
  condition: string
}

export interface PacketCallInfo {
  authPacket: boolean
  name: string
  transId: string
  packetId: string
  packetName: string
  type: string
  timeout: string
  choiceCall: string
  bgm: string
  condition: string
}

export interface PacketCall {
  general: General
  packetInfo: PacketCallInfo
  packetData: PacketData[]
  tracking: Tracking
}
