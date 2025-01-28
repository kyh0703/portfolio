import type { General, Tracking } from '../common'
import {
  type Format,
  type AgentType,
  type ChoiceCall,
} from '@/constants/options'

export interface TransferInfo {
  to: string
  timeout: string
  usrData: string
  format: Format
  switch: boolean
  hold: boolean
  agent: boolean
  agentType: AgentType
  choiceCall: ChoiceCall
}

export interface Transfer {
  general: General
  info: TransferInfo
  tracking: Tracking
}
