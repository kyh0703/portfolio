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
  nodeType: CustomNodeType,
): boolean => {
  switch (nodeType) {
    case 'Group':
    case 'Memo':
    case 'Ghost':
      return false
    default:
      return true
  }
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
