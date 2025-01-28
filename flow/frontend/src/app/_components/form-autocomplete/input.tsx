'use client'

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

type FormAutocompleteProps = {
  buttonRef?: LegacyRef<HTMLDivElement>
  value?: string
  placeholder?: string
  rows?: number
  disabled?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  hasSelectOptions?: boolean
  onClick?: MouseEventHandler
  onChange?: (text: string, onChange: (...event: any) => void) => void
  onRenderChange: (text: string, onChange: (...event: any) => void) => void
}

const FormAutocompleteInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormAutocompleteProps
>(
  (
    {
      buttonRef,
      value,
      placeholder,
      rows,
      disabled,
      readOnly,
      autoFocus,
      hasSelectOptions,
      onClick,
      onChange,
      onRenderChange,
    },
    ref,
  ) => {
    const handleChange: ChangeEventHandler<
      HTMLInputElement | HTMLTextAreaElement
    > = (e) => {
      onChange && onChange(e.target.value, onRenderChange)
    }
    return (
      <div className="relative">
        {rows && rows > 1 ? (
          <Textarea
            ref={ref as LegacyRef<HTMLTextAreaElement>}
            value={value}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            onChange={handleChange}
          />
        ) : (
          <Input
            ref={ref as LegacyRef<HTMLInputElement>}
            className="pr-8"
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            onChange={handleChange}
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
FormAutocompleteInput.displayName = 'FormAutocompleteInput'

export default memo(FormAutocompleteInput)
