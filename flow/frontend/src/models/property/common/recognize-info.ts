export interface GramList {
  grammar: string
  desc?: string
}

export interface RecognizeInfo {
  enable: boolean
  data: {
    name: string
    gramList: GramList[]
    sequence: string
    bargeIn: boolean
    confirm: boolean
    ignoreDtmf: boolean
    cdrWrite: boolean
    encrypt: boolean
    tracking: boolean
    sttName?: string
    startTimer: boolean
    noVoiceTimeout: string
    maxTimeout: string
    condition: string
  }
}
