'use client'

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
import { DIGITS } from '@/constants/digits'
import { useEdgeMenu } from '@/hooks/xyflow'
import type { Select } from '@/models/property/flow'
import { useQueryNodeProperty } from '@/services/flow'
import { showEdgeShortcut } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { EdgeMenuComponentProps } from './types'

export function SelectMenu({
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
    useQueryNodeProperty<Select>(sourceNode.data.databaseId!),
  )

  const filterUsedConditions = useMemo(
    () =>
      data?.property.select.link.filter(
        (link) => ![...DIGITS, 'default'].includes(link.condition),
      ),
    [data?.property.select.link],
  )

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
        {filterUsedConditions?.map((link) => (
          <DropdownMenuItem
            key={link.condition}
            className="flex gap-3"
            onClick={() => onSelect(link.condition)}
          >
            {link.condition}
            <DropdownMenuShortcut>
              {showEdgeShortcut(link.condition, sourceEdges)}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="flex gap-3"
          onClick={() => onSelect('default')}
        >
          Default
          <DropdownMenuShortcut>
            {showEdgeShortcut('default', sourceEdges)}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Digit</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {DIGITS.map((digit) => (
              <DropdownMenuItem
                key={digit}
                className="flex gap-3"
                onClick={() => onSelect(digit)}
              >
                {digit}
                <DropdownMenuShortcut>
                  {showEdgeShortcut(digit, sourceEdges)}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
