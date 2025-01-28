'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { ScrollArea } from '@/ui/scroll-area'
import { formatDateTime } from '@/utils'
import { PropsWithChildren } from 'react'

type SnapshotDropdownProps = {
  snapshots: string[]
  disabled: boolean
  onClick?: (name: string) => void
} & PropsWithChildren

export default function SnapshotDropdown({
  snapshots,
  disabled,
  onClick,
  children,
}: SnapshotDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled}>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <ScrollArea className="h-24">
          {snapshots.map((snapshot) => (
            <DropdownMenuItem
              key={snapshot}
              onClick={() => {
                onClick && onClick(snapshot)
              }}
            >
              {formatDateTime(snapshot)}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
