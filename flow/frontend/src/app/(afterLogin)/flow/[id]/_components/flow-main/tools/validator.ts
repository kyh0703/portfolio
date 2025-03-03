import type { AppEdge, Connection, IsValidConnection } from '@xyflow/react'

const validateSource = (source: string): boolean => {
  return true
}

const validateTarget = (target: string) => {
  return true
}

export const isValidConnection: IsValidConnection<AppEdge> = (
  edge: AppEdge | Connection,
) => {
  if (edge.source === edge.target) {
    return false
  }
  return true
}
