'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/ui/dropdown-menu'
import { DIGITS } from '@/constants/digits'
import { useEdgeMenu } from '@/hooks/xyflow'
import type { GetDigit } from '@/models/property/telephony'
import { useQueryNodeProperty } from '@/services/flow'
import { showEdgeShortcut } from '@/utils'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { EdgeMenuComponentProps } from './types'

export function GetDigitMenu({
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
    useQueryNodeProperty<GetDigit>(sourceNode.data.databaseId!),
  )

  const filteredDtmf = useMemo(() => {
    const dtmfMask = data?.property.digit.dtmfMask
    if (!dtmfMask) {
      return DIGITS
    }

    return dtmfMask
      .split('|')
      .filter((dtmf) => !data?.property.digit.endKey.includes(dtmf))
      .map((dtmf) => `'${dtmf}'`)
  }, [data?.property.digit.dtmfMask, data?.property.digit.endKey])

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
        {!sourceEdges.some((edge) => edge.data?.condition === 'digit') && (
          <DropdownMenuItem
            className="flex gap-3"
            onClick={() => onSelect('maxdtmf')}
          >
            MaxDTMF
            <DropdownMenuShortcut>
              {showEdgeShortcut('maxdtmf', sourceEdges)}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {data?.property.digit.endKey && (
          <DropdownMenuItem
            className="flex gap-3"
            onClick={() => onSelect('termdigit')}
          >
            Term Digit
            <DropdownMenuShortcut>
              {showEdgeShortcut('termdigit', sourceEdges)}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {data?.property.digit.endMethod !== 'disconnect' && (
          <>
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
            <DropdownMenuItem
              className="flex gap-3"
              onClick={() => onSelect('invalid')}
            >
              Invalid
              <DropdownMenuShortcut>
                {showEdgeShortcut('invalid', sourceEdges)}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
        {!sourceEdges.some((edge) => edge.data?.condition === 'maxdtmf') &&
          data?.property.ment?.ment &&
          data?.property.ment.ment.length < 2 && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Digit</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {filteredDtmf.map((digit) => (
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
                <DropdownMenuItem
                  className="flex gap-3"
                  onClick={() => onSelect('default')}
                >
                  Default
                  <DropdownMenuShortcut>
                    {showEdgeShortcut('default', sourceEdges)}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
