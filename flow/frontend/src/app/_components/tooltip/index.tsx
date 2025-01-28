import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip'
import { cn } from '@/utils/cn'
import { PropsWithChildren } from 'react'

export default function CustomTooltip({
  triggerChild,
  contentChild,
  className,
  disabled,
}: {
  triggerChild: React.ReactNode
  contentChild: React.ReactNode
  className?: string
  disabled?: boolean
} & PropsWithChildren) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className={cn(className)}>
          {triggerChild}
        </TooltipTrigger>
        {!disabled && (
          <TooltipPortal>
            <TooltipContent>{contentChild}</TooltipContent>
          </TooltipPortal>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
