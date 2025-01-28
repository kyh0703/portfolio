import type { EndKey, MentCountry, SafeTone } from '@/constants/options'
import type { ChatInfo } from './common'

interface STTTracking {
  enable: boolean
  encrypt: boolean
  id: string
  name: string
}

interface NLUTracking {
  enable: boolean
  encrypt: boolean
  id: string
  name: string
}

interface EntityInfo {
  id: string
  name: string
  inputType?: 'STT' | 'DIGIT'
  default?: boolean
  value?: string
  retry?: number
  choiceCall?: string
  sttTracking?: STTTracking
  nluTracking?: NLUTracking
  nluText?: boolean
  text?: string
}

interface MentCommon {
  ttsFailure: boolean
  retryIndex: string
}

interface TTSInfo {
  country?: MentCountry
  speakerId?: string
  name?: string
}

export interface MentList {
  kind: string
  expression: string
  type: string
  ttsInfo?: TTSInfo
  clearDigit?: boolean
  ignoreDtmf?: boolean
  tracking?: boolean
  condition: string
}

interface MentInfo {
  common?: MentCommon
  ment?: MentList[]
}

interface DigitInfo {
  cdrWrite?: boolean
  encrypt?: boolean
  length?: string
  dtmfMask?: string
  endKey?: EndKey
  errorKey?: EndKey
  timeout?: string
  interTimeout?: string
  safeTone?: SafeTone
}

export interface EntityList {
  info: EntityInfo
  mentInfo: MentInfo
  digitInfo?: DigitInfo
  chatInfo: ChatInfo
}

export interface DefineIntent {
  id: string
  name: string
  global?: boolean
  menuCall?: string
  subCall?: string
  entityList?: EntityList[]
}
