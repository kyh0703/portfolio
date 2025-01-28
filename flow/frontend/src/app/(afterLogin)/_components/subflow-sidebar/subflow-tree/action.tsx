'use client'

import { Button } from '@/app/_components/button'
import { cn } from '@/utils/cn'
import {
  ArrowDownNarrowWideIcon,
  ArrowDownWideNarrowIcon,
  FilePlusIcon,
  FolderPlusIcon,
} from 'lucide-react'

type ActionProps = {
  ascending: boolean
  onToggleAscending?: () => void
  onCreateFolder?: () => void
  onCreateFlow?: () => void
}

export default function Action({
  ascending,
  onToggleAscending,
  onCreateFolder,
  onCreateFlow,
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
        onDoubleClick={onCreateFolder}
      >
        <FolderPlusIcon width={15} height={15} />
      </Button>
      <Button
        className={cn('flex items-center justify-center', 'h-6 w-6')}
        variant="ghost"
        size="icon"
        onClick={onCreateFlow}
        onDoubleClick={onCreateFlow}
      >
        <FilePlusIcon width={15} height={15} />
      </Button>
    </div>
  )
}
