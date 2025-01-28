'use client'

import { Button } from '@/app/_components/button'
import { MenuDotIcon } from '@/app/_components/icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { ICellRendererParams } from 'ag-grid-community'

export default function CommonFlowListMenu(
  props: ICellRendererParams & {
    moveReplicate: () => void
    moveEdit: () => void
    moveDelete: () => void
  },
) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" size="icon">
          <MenuDotIcon width={16} height={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={props.moveReplicate}>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={props.moveEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={props.moveDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
