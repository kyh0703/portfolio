export interface DigitInfo {
  name: string
  length: string
  retry: string
  dtmfMask: string
  timeout: string
  interTimeout: string
  safeTone: string
  choiceCall: string
  endKey: string
  errorKey: string
  endMethod: string
  abandon: false
  errorInfo: {
    clearDigit: false
    timeout: MentInfo
    inputError: MentInfo
    retry: MentInfo
  }
  condition: string
}

interface MentInfo {
  ment: string
  tracking: boolean
}
