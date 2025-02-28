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

export function IfMenu({
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
          onClick={() => onSelect('true')}
        >
          True
          <DropdownMenuShortcut>
            {showEdgeShortcut('true', sourceEdges)}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-3"
          onClick={() => onSelect('false')}
        >
          False
          <DropdownMenuShortcut>
            {showEdgeShortcut('false', sourceEdges)}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
