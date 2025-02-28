'use client'

import { cn } from '@/utils'
import React from 'react'
import TabLabel from './tab-label'

export interface TabProps {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  fullWidth?: boolean
  selected?: boolean
  selectionFollowsFocus?: boolean
  value?: any
  iconPosition?: 'bottom' | 'end' | 'start' | 'top'
  indicator?: React.ReactNode
  icon?: React.ReactNode
  label?: string
  wrapped?: boolean
  align?: 'left' | 'center' | 'right'
  onChange?: (
    event:
      | React.FocusEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLButtonElement>,
    value: any,
  ) => void
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      className,
      disabled = false,
      fullWidth,
      icon: iconProp,
      iconPosition = 'top',
      indicator,
      label,
      selected,
      selectionFollowsFocus,
      value,
      wrapped = false,
      align = 'center',
      onChange,
      onFocus,
      onClick,
    },
    ref,
  ) => {
    const icon =
      iconProp && label && React.isValidElement(iconProp)
        ? React.cloneElement(iconProp, {})
        : iconProp

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      if (!selected && onChange) {
        onChange(event, value)
      }

      if (onClick) {
        onClick(event)
      }
    }

    const handleFocus: React.FocusEventHandler<HTMLButtonElement> = (event) => {
      if (selectionFollowsFocus && !selected && onChange) {
        onChange(event, value)
      }

      if (onFocus) {
        onFocus(event)
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'relative flex min-h-[48px] min-w-[90px] max-w-[360px] shrink-0 overflow-auto whitespace-nowrap px-[12px] py-[16px]',
          label &&
            (iconPosition === 'top' || iconPosition === 'bottom') &&
            'flex-col',
          label &&
            iconPosition !== 'top' &&
            iconPosition !== 'bottom' &&
            'flex w-full flex-row items-center justify-between gap-2',
          wrapped && 'whitespace-normal',
          className,
        )}
        role="tab"
        aria-selected={selected}
        onClick={handleClick}
        onFocus={handleFocus}
        tabIndex={selected ? 0 : -1}
        disabled={disabled}
      >
        {iconPosition === 'top' || iconPosition === 'start' ? (
          <>
            {icon}
            <TabLabel
              label={label!}
              align={align}
              className={cn(
                selected ? 'text-blue-850' : undefined,
                disabled && 'text-gray-400 dark:text-[#808080]',
              )}
            />
          </>
        ) : (
          <>
            <TabLabel
              label={label!}
              align={align}
              className={cn(
                selected ? 'text-blue-850' : undefined,
                disabled && 'text-gray-400 dark:text-[#808080]',
              )}
            />
            {icon}
          </>
        )}
        {indicator}
      </button>
    )
  },
)
Tab.displayName = 'Tab'
