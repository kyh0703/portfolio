'use client'

import AutocompleteInput from '@/app/_components/autocomplete/input'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/app/_components/command'
import useAutocompleteEvent from '@/hooks/use-autocomplete-event'
import { height } from '@/themes'
import { Portal } from '@radix-ui/react-portal'
import {
  ChangeEvent,
  MouseEventHandler,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { RemoveScroll } from 'react-remove-scroll'

type NodeTypeAutocompleteProps = {
  defineOptions: string[]
  nodeOptions: string[]
  rows?: number
  value?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

const NodeTypeAutocomplete = ({
  defineOptions,
  nodeOptions,
  rows,
  value,
  placeholder,
  disabled,
  onChange,
}: NodeTypeAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const inputButtonRef = useRef<HTMLDivElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)
  const [isListOpen, setIsListOpen] = useState<boolean>(false)
  const [dimensions, setDimensions] = useState({ top: 0, left: 0, width: 0 })

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsListOpen(true)
      onChange && onChange(e.target.value)
    },
    [onChange],
  )

  useAutocompleteEvent(isListOpen, inputButtonRef, portalRef, setIsListOpen)

  const updateDimensions = useCallback(() => {
    if (inputRef.current) {
      const { bottom, left, width } = inputRef.current.getBoundingClientRect()
      setDimensions({
        top: bottom + window.scrollY + parseInt(height['autocomplete-gap'], 10),
        left: left + window.scrollX,
        width: width,
      })
    }
  }, [])

  useEffect(() => {
    updateDimensions()
    if (inputRef.current) {
      const observer = new ResizeObserver(updateDimensions)
      observer.observe(inputRef.current)

      return () => {
        observer.disconnect()
      }
    }
  }, [updateDimensions])

  const handleSelect = useCallback(
    (select: string) => {
      setIsListOpen(false)
      onChange && onChange(select)
    },
    [onChange],
  )

  const handleClick = useCallback(() => setIsListOpen((prev) => !prev), [])

  const handlePreventEvent: MouseEventHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Command>
      <AutocompleteInput
        ref={inputRef}
        buttonRef={inputButtonRef}
        value={value}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        className="h-7"
        hasSelectOptions={true}
        onChange={handleChange}
        onClick={handleClick}
      />
      {isListOpen && (defineOptions.length > 0 || nodeOptions.length > 0) && (
        <Portal container={document.body} ref={portalRef}>
          <RemoveScroll>
            <CommandList
              className="absolute rounded-md border bg-background"
              style={{
                top: dimensions.top,
                left: dimensions.left,
                width: dimensions.width,
              }}
            >
              {defineOptions.length > 0 && (
                <>
                  <CommandGroup heading="Define">
                    <div style={{ maxHeight: height['autocomplete-list'] }}>
                      {defineOptions.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={handleSelect}
                          onMouseDown={handlePreventEvent}
                        >
                          <span className="overflow-x-hidden text-ellipsis text-nowrap">
                            {option}
                          </span>
                        </CommandItem>
                      ))}
                    </div>
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}
              {nodeOptions.length > 0 && (
                <CommandGroup heading="Node">
                  <div
                    className={`w-full overflow-y-auto`}
                    style={{ maxHeight: height['autocomplete-list'] }}
                  >
                    {nodeOptions.map((option) => (
                      <CommandItem
                        key={option}
                        value={option}
                        onSelect={handleSelect}
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
            </CommandList>
          </RemoveScroll>
        </Portal>
      )}
    </Command>
  )
}

export default memo(NodeTypeAutocomplete)
