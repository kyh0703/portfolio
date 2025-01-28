import { ChatInfoNluCategory } from '@/constants/options'

export interface MentColumnType {
  kind?: ChatInfoNluCategory | ''
  expression: string
  type: string
  ttsInfo?: {
    country: string
    speakerId: string
    ttsName: string
  }
  clearDigit?: boolean
  ignoreDtmf?: boolean
  tracking?: boolean
  async?: boolean
  condition: string
}

export interface MentInfo {
  common: {
    allTracking: boolean
    cdrWrite: boolean
    ttsFailure: boolean
    encrypt: boolean
    choiceCall: string
    retryIndex: string
    endMethod: string
  }
  ment: MentColumnType[]
}
