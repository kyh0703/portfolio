'use client'

import { useEdges, useNodes, useSelect } from '@/hooks/xyflow'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { useReactFlow, type AppEdge, type AppNode } from '@xyflow/react'
import {
  FlagTriangleLeftIcon,
  FlagTriangleRightIcon,
  TrashIcon,
} from 'lucide-react'
import { useCallback } from 'react'
import ContextMenu from '../../../../../../_components/context-menu'

export type EdgeContextMenuProps = {
  id: string
  mouse: {
    x: number
    y: number
  }
  onClick?: () => void
}

export function EdgeContextMenu({ id, ...props }: EdgeContextMenuProps) {
  const { getEdge } = useReactFlow<AppNode, AppEdge>()
  const targetEdge = getEdge(id)!

  const { removeEdgeToDB } = useEdges()
  const { selectNode } = useSelect()
  const { focusingNode } = useNodes()

  const handleDelete = useCallback(async () => {
    await removeEdgeToDB(targetEdge)
  }, [removeEdgeToDB, targetEdge])

  const handleFocus = useCallback(
    (nodeId: string) => {
      focusingNode(nodeId)
      selectNode(nodeId)
    },
    [focusingNode, selectNode],
  )

  return (
    <ContextMenu
      left={props.mouse.x}
      top={props.mouse.y}
      onClick={props.onClick}
    >
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
          <DropdownMenuItem
            className="flex gap-3 text-xs"
            onSelect={() => handleFocus(targetEdge.source)}
          >
            <FlagTriangleLeftIcon size={12} />
            ToSource
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-3 text-xs"
            onSelect={() => handleFocus(targetEdge.target)}
          >
            <FlagTriangleRightIcon size={12} />
            ToTarget
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ContextMenu>
  )
}
