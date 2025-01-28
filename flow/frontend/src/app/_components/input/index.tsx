'use client'

import { cn } from '@/utils/cn'
import * as React from 'react'
import { KeyboardEventHandler } from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, readOnly, type, ...props }, ref) => {
    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
      const target = event.target as HTMLInputElement
      if (event.key === 'Home') {
        target.setSelectionRange(0, 0)
      } else if (event.key === 'End') {
        target.setSelectionRange(target.value.length, target.value.length)
      }
      props.onKeyDown?.(event)
    }
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          readOnly && 'pointer-events-none',
          className,
        )}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
