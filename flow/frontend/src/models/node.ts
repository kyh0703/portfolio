import type { CustomNodeType } from '@xyflow/react'

type PositionXY = {
  x: number
  y: number
}

type Style = {
  bgColor: string
  color: string
  borderStyle: string
  borderColor: string
  width: number
  height: number
  hidden: boolean
}

type Group = {
  width: number
  height: number
  collapsed: boolean
}

export interface Node {
  id: number
  flowId: number
  nodeId: string
  kind: CustomNodeType
  label: string
  groupId: string
  pos: PositionXY
  style: Style
  group: Group
  property?: unknown
  desc: string
}
