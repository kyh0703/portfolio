import type { Command } from './types'

export const validateCommand = (
  subFlowName: string | undefined,
  command: Command,
) => {
  if (subFlowName === 'end') {
    switch (command.nodeType) {
      case 'Play':
      case 'GetDigit':
      case 'WaitInbound':
      case 'WaitOutbound':
      case 'Disconnect':
      case 'Record':
      case 'Abort':
      case 'Switch':
      case 'DisSwitch':
      case 'Transfer':
      case 'MakeCall':
      case 'GetChannel':
      case 'PushTone':
      case 'ChoiceMent':
      case 'ChoiceCall':
      case 'ToneDetect':
      case 'VoiceRecognize':
      case 'OpenVR':
      case 'RequestVR':
      case 'ResponseVR':
      case 'RegistServer':
      case 'WaitWebInbound':
      case 'NLURequest':
      case 'IntentCall':
      case 'EntityCall':
      case 'MenuCall':
      case 'MenuReturn':
      case 'Return':
      case 'ChangeService':
      case 'MenuChange':
      case 'CdrCall':
      case 'ConsumerMonit':
        return false
      default:
        return true
    }
  }

  return true
}
