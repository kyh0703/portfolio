'use client'

import { Button } from '@/app/_components/button'
import { AddIcon } from '@/app/_components/icon'
import { cn } from '@/utils/cn'
import {
  ArrowDownNarrowWideIcon,
  ArrowDownWideNarrowIcon,
  FolderPlusIcon,
} from 'lucide-react'

type ActionProps = {
  ascending: boolean
  openModal?: () => void
  onToggleAscending?: () => void
  onCreateFolder?: () => void
}

export default function Action({
  ascending,
  openModal,
  onToggleAscending,
  onCreateFolder,
}: ActionProps) {
  return (
    <div className="mt-1 flex">
      <Button
        className={cn('flex items-center justify-center', 'h-6 w-6')}
        variant="ghost"
        size="icon"
        onClick={onToggleAscending}
      >
        {ascending ? (
          <ArrowDownNarrowWideIcon width={15} height={15} />
        ) : (
          <ArrowDownWideNarrowIcon width={15} height={15} />
        )}
      </Button>
      <Button
        className={cn('flex items-center justify-center', 'h-6 w-6')}
        variant="ghost"
        size="icon"
        onClick={onCreateFolder}
      >
        <FolderPlusIcon width={15} height={15} />
      </Button>
      <Button
        className={cn('flex items-center justify-center', 'h-6 w-6')}
        variant="ghost"
        size="icon"
        onClick={openModal}
      >
        <AddIcon width={15} height={15} />
      </Button>
    </div>
  )
}
