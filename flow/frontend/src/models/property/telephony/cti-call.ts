import type { ArgumentInfo, General, ParameterInfo, Tracking } from '../common'

export interface CtiCallInfo {
  name: string
  command: string
  service: string
  choiceCall: string
  bgm: string
  timeout: string
  switch: boolean
  agent: boolean
  agentType: string
  condition: string
}

export interface CtiCall {
  general: General
  info: CtiCallInfo
  input: ParameterInfo
  output: ArgumentInfo
  tracking: Tracking
}
