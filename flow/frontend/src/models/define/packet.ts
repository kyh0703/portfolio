import type { Align, DefinePacketEncode, Trim } from '@/constants/options'

export interface PacketFormat {
  type: string
  name: string
  length?: string
  fill?: string
  align?: Align
  default?: string
  cntName?: string
  desc?: string
  encrypt?: boolean
  numeric?: boolean
  pattern?: string
  trim?: Trim
  encode?: DefinePacketEncode
  respCode?: boolean
}

export interface DefinePacket {
  id: string
  name: string
  comFormat?: boolean
  common?: string
  trim?: Trim
  sndPart?: PacketFormat[]
  rcvPart?: PacketFormat[]
  rptPart?: PacketFormat[]
}
