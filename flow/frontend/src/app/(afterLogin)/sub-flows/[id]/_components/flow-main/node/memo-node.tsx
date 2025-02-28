'use client'

import ColorPickerIcon from '@/app/_components/color-picker'
import { Textarea } from '@/app/_components/textarea'
import { useNodeDimensions, useNodes } from '@/hooks/xyflow'
import { useUpdateNode } from '@/services/subflow'
import { useSubFlowStore } from '@/store/sub-flow'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { cn } from '@/utils'
import {
  Handle,
  NodeResizer,
  NodeToolbar,
  Position,
  useReactFlow,
  useStore,
  type AppEdge,
  type AppNode,
  type CustomNodeProps,
  type OnResizeEnd,
  type ReactFlowState,
} from '@xyflow/react'
import debounce from 'lodash-es/debounce'
import {
  ALargeSmall,
  Baseline,
  Eye,
  GrabIcon,
  GripIcon,
  HandIcon,
  PaintBucket,
  RectangleHorizontal,
  SquareDashedMousePointer,
} from 'lucide-react'
import { useCallback, useRef, useState, type ChangeEventHandler } from 'react'
import { twJoin } from 'tailwind-merge'
import { useShallow } from 'zustand/react/shallow'

const borderStyleOptions = ['solid', 'dotted', 'dashed', 'double']

const opacityOptions = ['0.2', '0.4', '0.6', '0.8', '1']

const fontSizeOptions = ['xs', 'sm', 'base', 'lg', '2xl', '3xl']

const getFontSize = (fontSize?: string) => {
  switch (fontSize) {
    case 'xs':
      return 'text-xs'
    case 'sm':
      return 'text-sm'
    case 'base':
      return 'text-base'
    case 'lg':
      return 'text-lg'
    case '2xl':
      return 'text-2xl'
    case '3xl':
      return 'text-3xl'
    default:
      return 'text-base'
  }
}

const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connection.fromHandle?.nodeId

export function MemoNode({ id, selected, data }: CustomNodeProps) {
  const editMode = useSubFlowStore(useShallow((state) => state.editMode))
  const { style } = data
  const {
    borderColor,
    borderStyle,
    backgroundColor,
    color,
    opacity,
    fontSize,
  } = style!
  const { getNode } = useReactFlow<AppNode, AppEdge>()
  const [memo, setMemo] = useState(data.desc)
  const node = getNode(id)!

  const { width, height } = useNodeDimensions(id)
  const connectionNodeId = useStore(connectionNodeIdSelector)
  const isConnecting = !!connectionNodeId

  const updateNodeMutation = useUpdateNode()

  const fetchDesc = debounce((desc) => {
    updateNodeMutation.mutate(
      {
        nodeId: node.data.databaseId!,
        node: {
          ...node,
          data: { ...node.data, desc },
        },
      },
      { onError: () => updateNodeMutation.reset() },
    )
  }, 300)

  const fetchStyle = debounce((updateStyle) => {
    updateNodeMutation.mutate(
      {
        nodeId: node.data.databaseId!,
        node: {
          ...node,
          data: {
            ...node.data,
            style: { ...node.data.style, ...updateStyle },
          },
        },
      },
      { onError: () => updateNodeMutation.reset() },
    )
  }, 300)

  const { setNodeStyle, setDescription } = useNodes()

  const handleStyleChange = (name: string, value: string) => {
    setNodeStyle(id, name, value)
    fetchStyle({ [name]: value })
  }

  const handleMemoChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setDescription(id, event.target.value)
    setMemo(event.target.value)
    fetchDesc(event.target.value)
  }

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
    <div className={twJoin('relative')}>
      <NodeToolbar className="flex items-center justify-center gap-2">
        <ColorPickerIcon
          icon={<PaintBucket />}
          onChange={(event) =>
            handleStyleChange('backgroundColor', event.target.value)
          }
        />
        <ColorPickerIcon
          icon={<Baseline />}
          onChange={(event) => handleStyleChange('color', event.target.value)}
        />
        <ColorPickerIcon
          icon={<RectangleHorizontal />}
          onChange={(event) =>
            handleStyleChange('borderColor', event.target.value)
          }
        />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <SquareDashedMousePointer />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {borderStyleOptions.map((item) => (
              <DropdownMenuItem
                key={item}
                onClick={() => handleStyleChange('borderStyle', item)}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Eye />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {opacityOptions.map((item) => (
              <DropdownMenuItem
                key={item}
                onClick={() => handleStyleChange('opacity', item)}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <ALargeSmall />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {fontSizeOptions.map((item) => (
              <DropdownMenuItem
                key={item}
                onClick={() => handleStyleChange('fontSize', item)}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </NodeToolbar>
      <div className="drag-handle__custom absolute -top-4 right-0 flex">
        <GripIcon size={12} />
      </div>
      <div
        className="absolute h-full w-full rounded-sm border-[3px]"
        style={{
          width,
          height,
          color,
          backgroundColor,
          borderColor,
          borderStyle,
          opacity,
        }}
      >
        <div
          className={twJoin(
            'absolute',
            'flex items-center justify-center',
            'h-full w-full',
            'left-1/2 top-1/2',
            'z-[1] rounded-2xl',
            '-translate-x-1/2 -translate-y-1/2 transform',
          )}
        >
          {!isConnecting && (
            <Handle
              className="react-flow__memo node-handle"
              style={{ zIndex: 2 }}
              position={Position.Right}
              type="source"
            />
          )}
        </div>
        <div
          className={twJoin(
            'absolute left-0 top-0 p-0',
            'flex flex-col items-center justify-center',
            'h-full w-full',
            editMode === 'grab' && 'z-10',
          )}
        >
          <NodeResizer
            lineClassName={cn('!border-2')}
            isVisible={selected}
            onResizeEnd={handleResizeEnd}
          />
          <Textarea
            style={{
              width,
              height,
              background: 'transparent',
              resize: 'none',
              overflow: 'hidden',
            }}
            className={cn(
              'hover-none border-none text-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
              getFontSize(fontSize),
            )}
            value={memo}
            onChange={handleMemoChange}
          />
        </div>
      </div>
    </div>
  )
}
