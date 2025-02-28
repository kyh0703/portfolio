import type { ControlPointData, CustomEdgeType } from '@xyflow/react'

export interface Edge {
  id: string
  flowId: number
  source: string
  target: string
  type: CustomEdgeType
  label: string
  hidden: boolean
  markerEnd?: {
    width: number
    height: number
    type: string
    color: string
  }
  points: ControlPointData[]
  updateAt: Date
  createAt: Date
}
