'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { useEdgeMenu } from '@/hooks/xyflow'
import { showEdgeShortcut } from '@/utils'
import type { EdgeMenuComponentProps } from './types'

export function PacketJsonMenu({
  connection,
  sourceNode,
  targetNode,
}: EdgeMenuComponentProps) {
  const { sourceEdges, onSelect } = useEdgeMenu(
    connection,
    sourceNode,
    targetNode,
  )

  return (
    <DropdownMenu open={true} modal={false}>
      <DropdownMenuTrigger />
      <DropdownMenuContent
        className="nested-cursor-pointer"
        align="start"
        side="right"
      >
        <DropdownMenuItem
          className="flex gap-3"
          onClick={() => onSelect('next')}
        >
          Next
          <DropdownMenuShortcut>
            {showEdgeShortcut('next', sourceEdges)}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-3"
          onClick={() => onSelect('timeout')}
        >
          Timeout
          <DropdownMenuShortcut>
            {showEdgeShortcut('timeout', sourceEdges)}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-3"
          onClick={() => onSelect('error')}
        >
          Error
          <DropdownMenuShortcut>
            {showEdgeShortcut('error', sourceEdges)}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
