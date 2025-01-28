'use client'

import { height } from '@/themes'
import { cn } from '@/utils/cn'
import { Portal } from '@radix-ui/react-portal'
import { MouseEventHandler, forwardRef, memo, useMemo } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { CommandGroup, CommandItem, CommandList } from '../command'
import { Option } from '../form-autocomplete'

type FormAutocompleteListProps = {
  value: string
  input?: HTMLInputElement | HTMLTextAreaElement | null
  optionType?: 'option' | 'select' | null
  options?: string[]
  selectOptions?: Option[]
  onSelectVariable?: (
    text: string,
    select: string,
    onChange: (...event: any) => void,
  ) => void
  onSelectOption?: (select: string, onChange: (...event: any) => void) => void
  onRenderChange: (text: string, onChange: (...event: any) => void) => void
}

const FormAutocompleteList = forwardRef<
  HTMLDivElement,
  FormAutocompleteListProps
>(function FormAutocompleteList(
  {
    value,
    input,
    optionType,
    options,
    selectOptions,
    onSelectVariable,
    onSelectOption,
    onRenderChange,
  },
  ref,
) {
  const [top, left, width] = useMemo(() => {
    if (!input) return [0, 0, 0]

    const viewportHeight = window.innerHeight
    const inputRect = input.getBoundingClientRect()

    const inputTop = inputRect.top + window.scrollY
    const inputBottom = inputRect.bottom + window.scrollY
    const left = inputRect.left + window.scrollX
    const width = inputRect.width

    const items = optionType === 'option' ? options : selectOptions

    let listHeight = 0

    const maxItemLength = parseInt(height['autocomplete-item-max-length'], 10)
    const headerHeight = parseInt(height['autocomplete-header'], 10)
    const listHeightValue = parseInt(height['autocomplete-list'], 10)
    const itemHeight = parseInt(height['autocomplete-item'], 10)
    const autocompleteGap = parseInt(height['autocomplete-gap'], 10)

    if (items && items.length > 0) {
      listHeight =
        items.length >= maxItemLength
          ? headerHeight + listHeightValue
          : headerHeight + items.length * itemHeight
    }

    const isOverflowing =
      inputBottom + listHeight + autocompleteGap > viewportHeight
    const top = isOverflowing
      ? inputTop - listHeight - autocompleteGap
      : inputBottom + autocompleteGap

    return [top, left, width]
  }, [input, options, selectOptions, optionType])

  // 마우스 클릭 시 handleSelectItem이 호출되도록 이벤트를 중지한다.
  const handlePreventEvent: MouseEventHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Portal container={document.body} ref={ref}>
      <RemoveScroll>
        <CommandList
          className={cn('absolute z-50')}
          style={{
            top,
            left,
            width,
          }}
        >
          <>
            {optionType === 'option' && options && options.length > 0 && (
              <CommandGroup
                heading="variables"
                className={cn('rounded-md border bg-background')}
              >
                <div
                  style={{
                    maxHeight: height['autocomplete-list'],
                    overflowY: 'auto',
                  }}
                >
                  {options.map((option) => (
                    <CommandItem
                      key={option}
                      onSelect={(select) =>
                        onSelectVariable &&
                        onSelectVariable(value, select, onRenderChange)
                      }
                      onMouseDown={handlePreventEvent}
                    >
                      <span className="overflow-x-hidden text-ellipsis text-nowrap">
                        {option}
                      </span>
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            )}
            {optionType === 'select' && selectOptions && (
              <CommandGroup
                heading="Options"
                className={cn('rounded-md border bg-background')}
              >
                <div
                  style={{
                    maxHeight: height['autocomplete-list'],
                    overflowY: 'auto',
                  }}
                >
                  {selectOptions.map((option) => {
                    const optionKey =
                      typeof option === 'object' ? option.value : option
                    const optionLabel =
                      typeof option === 'object'
                        ? option.label
                        : option === ''
                          ? '\u00A0'
                          : option

                    return (
                      <CommandItem
                        key={optionLabel}
                        value={optionKey}
                        onSelect={(select) =>
                          onSelectOption &&
                          onSelectOption(select, onRenderChange)
                        }
                        onMouseDown={handlePreventEvent}
                      >
                        <span className="overflow-x-hidden text-ellipsis text-nowrap">
                          {optionLabel}
                        </span>
                      </CommandItem>
                    )
                  })}
                </div>
              </CommandGroup>
            )}
          </>
        </CommandList>
      </RemoveScroll>
    </Portal>
  )
})

export default memo(FormAutocompleteList)
