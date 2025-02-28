'use client'

import { GroupIcon } from '@/app/_components/icon'
import { useNodeDimensions } from '@/hooks/xyflow'
import { useUpdateNode } from '@/services/subflow'
import { cn } from '@/utils'
import {
  getRelativeNodesBounds,
  isEqual,
} from '@/utils/xyflow/dynamic-grouping'
import {
  Handle,
  NodeResizer,
  Position,
  useNodes,
  useReactFlow,
  useStore,
  type AppEdge,
  type AppNode,
  type CustomNodeProps,
  type OnResizeEnd,
} from '@xyflow/react'
import { useCallback } from 'react'
import { twJoin } from 'tailwind-merge'

export function GroupNode({ id, data, selected }: CustomNodeProps) {
  const { label } = data
  const group = data.group

  const nodes = useNodes()
  const { getNode } = useReactFlow<AppNode, AppEdge>()
  const node = getNode(id)!

  const updateNodeMutation = useUpdateNode()

  const hasChild = nodes.some((node) => node.parentId === id)
  const { minWidth, minHeight } = useStore((store) => {
    const childNodes = Array.from(store.nodeLookup.values()).filter(
      (node) => node.parentId === id,
    )
    const rect = getRelativeNodesBounds(childNodes)

    return {
      minWidth: rect.x + rect.width,
      minHeight: rect.y + rect.height,
      hasChildNodes: childNodes.length > 0,
    }
  }, isEqual)
  const { width, height } = useNodeDimensions(id)

  const handleResizeEnd: OnResizeEnd = useCallback(
    (event, param) => {
      updateNodeMutation.mutate(
        {
          nodeId: node.data.databaseId!,
          node: {
            ...node,
            data: {
              ...node.data,
              style: {
                ...node.data.style,
                ...{
                  width: param.width,
                  height: param.height,
                },
              },
            },
            position: {
              x: param.x,
              y: param.y,
            },
            width: param.width,
            height: param.height,
          },
        },
        { onError: () => updateNodeMutation.reset() },
      )
    },
    [node, updateNodeMutation],
  )

  return (
    <div
      className={twJoin('relative outline-none', selected && 'outline-dashed')}
      style={{ width, height }}
    >
      {group?.collapsed ? (
        <GroupIcon width={width} height={height} />
      ) : (
        <NodeResizer
          lineClassName={cn(
            '!border-dashed !border-4 !border-[#09b39c]',
            !hasChild && '!border-border',
          )}
          handleClassName="!bg-blue-200 !border-blue-200"
          minWidth={minWidth}
          minHeight={minHeight}
          onResizeEnd={handleResizeEnd}
        />
      )}
      <div
        className={cn(
          'react-flow__group',
          'absolute',
          'flex items-center justify-center',
          'h-full w-full',
          'left-1/2 top-1/2',
          'z-[1] rounded-2xl',
          '-translate-x-1/2 -translate-y-1/2 transform',
        )}
      >
        <Handle
          className="node-handle"
          position={Position.Right}
          hidden={!group?.collapsed}
          type="source"
          isConnectable={false}
        />
        <Handle
          className="node-handle"
          position={Position.Left}
          type="target"
          hidden={!group?.collapsed}
          isConnectable={false}
        />
      </div>
      {group?.collapsed && (
        <div
          className="pointer-events-none absolute mt-1 flex w-full flex-col items-center justify-center gap-1"
          style={{ top: height }}
        >
          <span className="whitespace-nowrap text-xxs font-bold">{id}</span>
          <p className="line-clamp-3 w-full break-words text-center text-bs">
            {label}
          </p>
        </div>
      )}
    </div>
  )
}
