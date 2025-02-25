'use client'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/collapsible'
import { ChevronRight } from 'lucide-react'
import { type PropsWithChildren } from 'react'
import type { OutlineKey } from '.'

type CollapsibleItemProps = {
  label: OutlineKey
  open: boolean
  onOpenChange?: () => void
} & PropsWithChildren

export default function CollapsibleItem({
  label,
  open,
  children,
  onOpenChange,
}: CollapsibleItemProps) {
  return (
    <Collapsible
      className="flex h-full w-full flex-col"
      open={open}
      onOpenChange={onOpenChange}
    >
      <CollapsibleTrigger className="flex w-full items-center gap-2 p-2 text-sm font-medium hover:bg-muted/50">
        <ChevronRight
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? 'rotate-90' : ''
          }`}
        />
        {label}
      </CollapsibleTrigger>
      <CollapsibleContent className="flex h-full w-full overflow-auto">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
