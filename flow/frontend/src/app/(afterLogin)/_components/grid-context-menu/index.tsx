'use client'

import type { AbsolutePosition } from '@/app/_components/context-menu'
import ContextMenu from '@/app/_components/context-menu'
import {
  CopyIcon,
  CutIcon,
  DeleteIcon,
  PasteIcon,
} from '@/app/_components/icon'
import { ContextMenuShortcut } from '@/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'

const menuItemStyle = 'text-xs flex gap-3'

type GridContextMenuProps = {
  onClick?: () => void
  onItemClick?: (item: string) => void
} & AbsolutePosition

export function GridContextMenu({ ...props }: GridContextMenuProps) {
  const { top, left, bottom, right, onClick } = props
  return (
    <ContextMenu
      top={top}
      left={left}
      bottom={bottom}
      right={right}
      onClick={onClick}
    >
      <DropdownMenu open={true} modal={false} onOpenChange={onClick}>
        <DropdownMenuTrigger />
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem
            className={menuItemStyle}
            onClick={() => props.onItemClick?.('delete')}
          >
            <DeleteIcon size={12} />
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex gap-3 text-xs"
            onClick={() => props.onItemClick?.('cut')}
          >
            <CutIcon size={12} />
            cut
            <ContextMenuShortcut>⌘ + X</ContextMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-3 text-xs"
            onClick={() => props.onItemClick?.('copy')}
          >
            <CopyIcon size={12} />
            copy
            <ContextMenuShortcut>⌘ + C</ContextMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-3 text-xs"
            onClick={() => props.onItemClick?.('paste')}
          >
            <PasteIcon size={12} />
            paste
            <ContextMenuShortcut>⌘ + V</ContextMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ContextMenu>
  )
}
