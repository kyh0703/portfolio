'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { ScrollArea } from '@/ui/scroll-area'
import { PropsWithChildren } from 'react'

function formatDateTime(text: string) {
  const year = text.substring(0, 4)
  const month = text.substring(4, 6)
  const day = text.substring(6, 8)
  const hour = text.substring(8, 10)
  const minute = text.substring(10, 12)
  const second = text.substring(12, 14)
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

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
