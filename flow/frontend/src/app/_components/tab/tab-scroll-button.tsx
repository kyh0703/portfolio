import React from 'react'
import { TabLeftArrowIcon, TabRightArrowIcon } from '../icon'
import { cn } from '@/utils/cn'

interface TabScrollButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  direction: 'left' | 'right'
  disabled: boolean
}

const TabScrollButton = React.forwardRef<HTMLDivElement, TabScrollButtonProps>(
  ({ direction, disabled, onClick, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex shrink-0 items-center hover:bg-accent', className)}
        onClick={onClick}
        {...props}
      >
        {direction === 'left' ? <TabLeftArrowIcon /> : <TabRightArrowIcon />}
      </div>
    )
  },
)

TabScrollButton.displayName = 'TabScrollButton'
export default TabScrollButton
