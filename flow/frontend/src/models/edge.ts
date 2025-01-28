import type { ControlPointData, CustomEdgeType } from '@xyflow/react'

export interface Edge {
  id: number
  subFlowId: number
  edgeId: string
  kind: CustomEdgeType
  cond: string
  srcNodeId: string
  dstNodeId: string
  hidden: boolean
  markerEnd?: {
    width: number
    height: number
    type: string
    color: string
  }
  points: ControlPointData[]
}
