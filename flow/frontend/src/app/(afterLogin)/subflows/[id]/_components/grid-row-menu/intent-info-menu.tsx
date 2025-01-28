'use client'

import { Button } from '@/app/_components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { MenuDotIcon } from '@/app/_components/icon'
import { ICellRendererParams } from 'ag-grid-community'

export default function IntentInfoMenu(
  props: ICellRendererParams & {
    moveIntentPage: () => void
    moveMenuPage: () => void
    openFlowPage: () => void
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
        <DropdownMenuItem onClick={props.moveIntentPage}>
          Move Intent
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
