'use client'

import { useNodeDimensions } from '@/hooks/xyflow'
import {
  Position,
  useStore,
  type CustomNodeProps,
  type ReactFlowState,
} from '@xyflow/react'
import { LimitHandle } from '../tools'

const selector = (state: ReactFlowState) => ({
  connectOnClick: state.connectOnClick,
  noPanClassName: state.noPanClassName,
  rfId: state.rfId,
})

export function GhostNode({ id }: CustomNodeProps) {
  const { width, height } = useNodeDimensions(id)
  const store = useStore(selector)
  store.connectOnClick = false

  return (
    <div
      className="relative flex rounded-full bg-foreground text-background"
      style={{ width, height }}
    >
      <LimitHandle
        className="node-handle"
        position={Position.Top}
        isConnectable={false}
        type="source"
        connectionCount={1}
      />
      <LimitHandle
        className="node-handle z-0"
        position={Position.Top}
        type="target"
        isConnectable={false}
        connectionCount={1}
      />
    </div>
  )
}
