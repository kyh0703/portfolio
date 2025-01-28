'use client'

import * as React from 'react'

import { cn } from '@/utils/cn'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, readOnly, ...props }, ref) => {
    const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
      event,
    ) => {
      const target = event.target as HTMLInputElement
      if (event.key === 'Home') {
        target.setSelectionRange(0, 0)
      } else if (event.key === 'End') {
        target.setSelectionRange(target.value.length, target.value.length)
      }
      props.onKeyDown?.(event)
    }

    return (
      <textarea
        ref={ref}
        className={cn(
          'flex w-full rounded-md border border-input bg-background',
          'px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
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
Textarea.displayName = 'Textarea'

export { Textarea }
