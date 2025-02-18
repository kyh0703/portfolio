'use client'

import { Button } from '@/app/_components/button'
import { MenuDotIcon } from '@/app/_components/icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { ICellRendererParams } from 'ag-grid-community'

export default function ExpandMenuInfoMenu(
  props: ICellRendererParams & {
    moveMenuPage: () => void
    openFlowPage: () => void
  },
) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" size="icon">
          <MenuDotIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={props.moveMenuPage}>
          Move Menu
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={props.openFlowPage}>
          Open Flow
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
