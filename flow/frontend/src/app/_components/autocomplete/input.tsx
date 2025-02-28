'use client'

import { cn } from '@/utils'
import { ChevronDown } from 'lucide-react'
import {
  ChangeEventHandler,
  LegacyRef,
  MouseEventHandler,
  forwardRef,
  memo,
} from 'react'
import { Button } from '../button'
import { Input } from '../input'
import { Textarea } from '../textarea'

type AutocompleteProps = {
  buttonRef?: LegacyRef<HTMLDivElement>
  value?: string
  className?: string
  placeholder?: string
  rows?: number
  disabled?: boolean
  readOnly?: boolean
  hasSelectOptions?: boolean
  onChange?: ChangeEventHandler
  onClick?: MouseEventHandler
  onBlur?: () => void
}

const AutocompleteInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  AutocompleteProps
>(
  (
    {
      buttonRef,
      value,
      className,
      placeholder,
      rows,
      disabled,
      readOnly = false,
      hasSelectOptions,
      onChange,
      onClick,
      onBlur,
    },
    ref,
  ) => {
    return (
      <div className="relative">
        {rows && rows > 1 ? (
          <Textarea
            ref={ref as LegacyRef<HTMLTextAreaElement>}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            rows={rows}
            readOnly={readOnly}
            onChange={onChange}
            onBlur={onBlur}
          />
        ) : (
          <Input
            ref={ref as LegacyRef<HTMLInputElement>}
            className={cn('pr-8', className)}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            readOnly={readOnly}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
        {hasSelectOptions && !disabled && (
          <div
            className="absolute inset-y-0 -right-2 flex w-12 items-center"
            ref={buttonRef}
          >
            <Button variant="link" size="icon" onClick={onClick}>
              <ChevronDown className="text-gray-460" width={16} height={16} />
            </Button>
          </div>
        )}
      </div>
    )
  },
)
AutocompleteInput.displayName = 'AutocompleteInput'

export default memo(AutocompleteInput)
