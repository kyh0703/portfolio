import { cn } from '@/utils/cn'
import React from 'react'

interface TabsScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const TabsScroller = React.forwardRef<HTMLDivElement, TabsScrollerProps>(
  ({ children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-block flex-1 overflow-auto whitespace-nowrap scrollbar-hide',
        )}
      >
        {children}
      </div>
    )
  },
)

TabsScroller.displayName = 'TabsScroller'
