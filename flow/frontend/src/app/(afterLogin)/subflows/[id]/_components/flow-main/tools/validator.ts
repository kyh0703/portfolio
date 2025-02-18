import type { FlowMode } from '@/models/flow'
import type {
  AppEdge,
  Connection,
  CustomNodeType,
  IsValidConnection,
} from '@xyflow/react'

const validateSource = (source: string): boolean => {
  if (source.includes('GotoLabel')) {
    return false
  }
  if (source.includes('MenuReturn')) {
    return false
  }
  if (source.includes('Return')) {
    return false
  }
  return true
}

const validateTarget = (target: string) => {
  if (target.includes('Start')) {
    return false
  }
  if (target.includes('Memo')) {
    return false
  }
  return true
}

export const isValidConnection: IsValidConnection<AppEdge> = (
  edge: AppEdge | Connection,
) => {
  if (edge.source === edge.target) {
    return false
  }
  if (!validateSource(edge.source)) {
    return false
  }
  if (!validateTarget(edge.target)) {
    return false
  }
  return true
}

export const hasPropertyNode = (
  flowMode: FlowMode,
  nodeType: CustomNodeType,
): boolean => {
  switch (nodeType) {
    case 'Group':
    case 'Memo':
    case 'Ghost':
      return false
    default:
      break
  }

  if (flowMode === 'beginner') {
    switch (nodeType) {
      case 'Play':
      case 'GetDigit':
      case 'WaitInbound':
      case 'WaitOutbound':
      case 'Disconnect':
      case 'Record':
      case 'Abort':
      case 'Transfer':
      case 'MakeCall':
      case 'GetChannel':
      case 'CtiCall':
      case 'VoiceRecognize':
      case 'OpenVR':
      case 'CloseVR':
      case 'RequestPage':
      case 'GetPageData':
      case 'RegistServer':
      case 'UnregistServer':
      case 'WaitWebInbound':
      case 'DisconnectWeb':
      case 'NLURequest':
      case 'IntentCall':
      case 'EntityCall':
      case 'If':
      case 'Select':
      case 'Assign':
      case 'MenuCall':
      case 'MenuReturn':
      case 'SubCall':
      case 'Return':
      case 'ChangeService':
      case 'Sleep':
      case 'Cdr':
      case 'UserEnv':
      case 'UserFuncCall':
      case 'PacketJson':
        return true
      default:
        return false
    }
  }

  return true
}

export const hasParentNode = (nodeType: string): boolean => {
  switch (nodeType) {
    case 'Start':
    case 'Memo':
    case 'Ghost':
      return false
    default:
      return true
  }
}
