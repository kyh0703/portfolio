'use client'

import { useNodes, useRemove, useUndoRedo } from '@/hooks/xyflow'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import {
  useReactFlow,
  useStoreApi,
  type AppEdge,
  type AppNode,
} from '@xyflow/react'
import { TrashIcon } from 'lucide-react'
import { useCallback } from 'react'
import ContextMenu from '../../../../../../_components/context-menu'

export type NodeContextMenuProps = {
  id: string
  mouse: {
    x: number
    y: number
  }
  onClick?: () => void
}

export function NodeContextMenu({ id, ...props }: NodeContextMenuProps) {
  const store = useStoreApi()
  const { getNode, getNodes, setNodes } = useReactFlow<AppNode, AppEdge>()
  const targetNode = getNode(id)!
  const flowId = targetNode.data.flowId!

  const { nodeFactory } = useNodes()
  const { saveHistory } = useUndoRedo(flowId)
  const { removeNode } = useRemove(flowId)

  const selectedNodes = getNodes().filter((node) => node.selected)

  const handleDelete = useCallback(async () => {
    await removeNode(id)
  }, [removeNode, id])

  return (
    <ContextMenu left={props.mouse.x} top={props.mouse.y}>
      <DropdownMenu open={true} modal={false} onOpenChange={props.onClick}>
        <DropdownMenuTrigger />
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex gap-3 text-xs"
            onSelect={handleDelete}
          >
            <TrashIcon size={12} />
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </ContextMenu>
  )
}
