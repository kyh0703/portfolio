'use client'

import { Option } from '@/app/_components/autocomplete'
import AutocompleteInput from '@/app/_components/autocomplete/input'
import AutocompleteList from '@/app/_components/autocomplete/list'
import { Command } from '@/app/_components/command'
import useAutocompleteEvent from '@/hooks/use-autocomplete-event'
import { ChangeEvent, memo, useCallback, useRef, useState } from 'react'

type AutocompleteProps = {
  value?: string
  rows?: number
  selectOptions?: Option[]
  placeholder?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

const NameAutocomplete = (props: AutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const inputButtonRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [isListOpen, setIsListOpen] = useState(false)

  useAutocompleteEvent(isListOpen, inputButtonRef, listRef, setIsListOpen)

  const handleSelectOption = useCallback(
    (select: string) => {
      setIsListOpen(false)
      props?.onChange && props.onChange(select)
    },
    [props],
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsListOpen(true)
      props?.onChange && props.onChange(e.target.value)
    },
    [props],
  )

  const handleClick = useCallback(() => setIsListOpen((prev) => !prev), [])

  return (
    <Command>
      <AutocompleteInput
        {...props}
        ref={inputRef}
        buttonRef={inputButtonRef}
        className="h-7"
        hasSelectOptions={true}
        onChange={handleChange}
        onClick={handleClick}
        onBlur={() => setIsListOpen(false)}
      />
      {isListOpen && (
        <AutocompleteList
          {...props}
          ref={listRef}
          input={inputRef.current}
          optionType="select"
          onSelectOption={handleSelectOption}
        />
      )}
    </Command>
  )
}

export default memo(NameAutocomplete)
