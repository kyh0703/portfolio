'use client'

import { Button } from '@/app/_components/button'
import type { BuildType } from '@/models/build'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { Wrench } from 'lucide-react'

type IdleButtonProps = {
  onClick?: (buildType: BuildType) => void
}

export default function IdleButton({ onClick }: IdleButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex h-[36px] w-[110px] justify-between"
          variant="secondary"
        >
          <Wrench className="mr-2" size={18} />
          <span className="grow">Build</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onClick?.('build')}>
          Build
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onClick?.('rebuild')}>
          Rebuild
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
