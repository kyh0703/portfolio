import type { AppEdge } from '@xyflow/react'

export function showEdgeShortcut(condition: string, edges?: AppEdge[]) {
  const edge = edges?.find((edge) => edge.data!.condition! === condition)
  return edge?.target ?? ''
}
