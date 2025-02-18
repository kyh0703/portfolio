'use client'

import { Button } from '@/app/_components/button'
import { cn } from '@/utils/cn'
import {
  ListXIcon,
  PanelTopCloseIcon,
  PanelTopOpenIcon,
  SettingsIcon,
} from 'lucide-react'
import { DispatchWithoutAction } from 'react'

type SearchActionProps = {
  isOpenFilter: boolean
  isOpenCollapseAll: boolean
  disabled: boolean
  toggleIsOpenFilter?: DispatchWithoutAction
  onResetAll?: () => void
  onCollapseAll?: () => void
}

export default function SearchAction({
  isOpenFilter,
  isOpenCollapseAll,
  disabled,
  toggleIsOpenFilter,
  onResetAll,
  onCollapseAll,
}: SearchActionProps) {
  return (
    <div className={cn('flex justify-end', 'px-2 pt-1')}>
      <Button
        className={cn('flex items-center justify-center', 'h-6 w-6')}
        variant="ghost"
        size="icon"
        onClick={onResetAll}
      >
        <ListXIcon size={13} />
      </Button>
      <Button
        className={cn('flex items-center justify-center', 'h-6 w-6')}
        variant="ghost"
        size="icon"
        disabled={disabled}
      >
        {isOpenCollapseAll ? (
          <PanelTopOpenIcon size={13} onClick={onCollapseAll} />
        ) : (
          <PanelTopCloseIcon size={13} onClick={onCollapseAll} />
        )}
      </Button>
      <Button
        className={cn(
          'flex items-center justify-center',
          'h-6 w-6',
          isOpenFilter && 'bg-accent',
        )}
        variant="ghost"
        size="icon"
        onClick={toggleIsOpenFilter}
      >
        <SettingsIcon size={15} />
      </Button>
    </div>
  )
}
