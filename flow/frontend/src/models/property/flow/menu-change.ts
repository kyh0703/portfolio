import type { General, RecognizeInfo, Tracking } from '../common'

export interface MCMentInfo {
  ment: {
    clearDigit: boolean
    choiceMent: string
    mentType: string
    ttsInfo: {
      speakerID: string
      name: string
    }
    timeout: string
    retry: string
    playIndex: string
    retryDtmf: string
  }
  errorInfo: {
    clearDigit: boolean
    timeout: string
    inputError: string
    retry: string
  }
  condition: string
}

export interface MenuData {
  dtmf: string
  vrValue?: string
  menuId: string
  desc?: string
}

export interface MenuChangeInfo {
  topMenu: string
  upMenu: string
  topKey: string
  upKey: string
  dtmfLen: string
  variableUse: boolean
  menuData: MenuData[]
}

export interface VrAction {
  highScore: string
  lowScore: string
  errorInfo: {
    clearDigit: boolean
    timeout: string
    inputError: string
    retry: string
  }
}

export interface MenuChange {
  general: General
  mentInfo: MCMentInfo
  menuInfo: MenuChangeInfo
  recognizeInfo: RecognizeInfo
  vrAction: VrAction
  tracking: Tracking
}
