import type { General, Tracking } from '../common'

export interface MakeCallInfo {
  to: string
  ani: string
  usrData: string
  format: string
  timeout: string
  toneDetect: boolean
  toneDialTimeout: string
  toneTimeout: string
  agent: boolean
  agentType: string
  mediaType: string
  dnGroupName: string
  choiceCall: string
  relayHeader: string
}

export interface MakeCall {
  general: General
  info: MakeCallInfo
  tracking: Tracking
}
