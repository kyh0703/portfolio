import type { General } from '../common'

export interface PacketSizeInfo {
  name: string
  packetId: string
  condition: string
}

export interface PacketSize {
  general: General
  packetInfo: PacketSizeInfo
}
