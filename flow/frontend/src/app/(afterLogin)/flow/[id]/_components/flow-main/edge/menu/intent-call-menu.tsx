'use client'

import { useEdgeMenu } from '@/hooks/xyflow'
import { IntentCall } from '@/models/property/ai'
import { useQueryNodeProperty } from '@/services/flow'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { showEdgeShortcut } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import type { EdgeMenuComponentProps } from './types'

export function IntentCallMenu({
  connection,
  sourceNode,
  targetNode,
}: EdgeMenuComponentProps) {
  const { sourceEdges, onSelect } = useEdgeMenu(
    connection,
    sourceNode,
    targetNode,
  )

  const { data, isLoading, isError } = useQuery(
    useQueryNodeProperty<IntentCall>(sourceNode.data.databaseId!),
  )

  const filterUsedConditions = data?.property.intentInfo.intentList

  if (isLoading || isError) {
    return null
  }

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
          onClick={() => onSelect('nomatch')}
        >
          Nomatch
          <DropdownMenuShortcut>
            {showEdgeShortcut('nomatch', sourceEdges)}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        {filterUsedConditions && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>IntentGroup</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {filterUsedConditions.map(({ id }) => (
                <DropdownMenuItem
                  key={id}
                  className="flex gap-3"
                  onClick={() => onSelect(id)}
                >
                  {id}
                  <DropdownMenuShortcut>
                    {showEdgeShortcut(id, sourceEdges)}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
