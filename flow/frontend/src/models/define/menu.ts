import type { ChatInfo } from './common'

export interface ErrorMent {
  timeout: boolean
  input: boolean
  retry: boolean
}

export interface DigitError {
  check: boolean
  errorMent: ErrorMent
}

export interface MenuMent {
  caption: boolean
  choice: boolean
  digitError: DigitError
  vrError: DigitError
}

export interface MenuTracking {
  check: boolean
  ment: MenuMent
}

export interface MenuControl {
  block: boolean
  tracking: boolean
  vr: boolean
}

export interface MenuCheckOption {
  tracking?: MenuTracking
  control?: MenuControl
}

export interface Timeout {
  ment: string
  tracking: boolean
}

export interface ErrorInfo {
  clearDigit: boolean
  tracking: boolean
  timeout: Timeout
  input: Timeout
  retry: Timeout
}

export interface MenuOption {
  topKey: string
  upKey: string
  timeout: string
  retry: string
  errorInfo?: ErrorInfo
  termFlowId?: string
  menuFilter?: string
}

export interface GramList {
  gram: string
  desc?: string
}

export interface MenuVRInfo {
  voice?: string
  gramList?: GramList[]
  seq?: string
  bargeIn?: boolean
  sttName?: string
  startTimer?: boolean
  noVoiceTimeout?: string
  maxTimeout?: string
}

interface MenuRecognize {
  highScore?: string
  lowScore?: string
  proDTMF?: boolean
  subFlowName?: string
}

interface MenuVRAction {
  recog?: MenuRecognize
  errorInfo?: ErrorInfo
}

interface TTSInfo {
  country: string
  speakerId: string
  name: string
}

interface CapMent {
  ment?: string
  type?: string
  tracking?: boolean
  ttsInfo?: TTSInfo
}

export interface DefineMenu {
  id: string
  name: string
  rootId: number
  parentId: number
  svcCode?: string
  dtmf?: string
  custom?: boolean
  capMent: CapMent
  choiceMent: CapMent
  subFlowName?: string
  dtmfMask?: string
  length?: string
  playIndex?: string
  retryDtmf?: string
  condition: string
  menuOpt: MenuOption
  vrInfo?: MenuVRInfo
  vrAct?: MenuVRAction
  chat: ChatInfo
}
