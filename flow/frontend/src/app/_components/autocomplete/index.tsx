'use client'

import useAutocompleteEvent from '@/hooks/use-autocomplete-event'
import { extractKeyword } from '@/utils'
import { ChangeEvent, useCallback, useRef, useState } from 'react'
import { Command } from '../command'
import AutocompleteInput from './input'
import AutocompleteList from './list'

export type Option = Record<'value' | 'label', string> | string

type AutocompleteProps = {
  name: string
  value?: string
  rows?: number
  options?: string[]
  selectOptions?: Option[]
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  onChange?: (name: string, value: string) => void
  onValueChange?: (name: string, value: string) => void
}

export default function Autocomplete(props: AutocompleteProps) {
  const { name, value, options, selectOptions, onChange, onValueChange } = props

  const [optionType, setOptionType] = useState<'option' | 'select' | null>(null)
  const [isListOpen, setIsListOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const inputButtonRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const cursorPosition = useRef(0)
  const originalWord = useRef('')

  useAutocompleteEvent(
    isListOpen,
    inputButtonRef,
    listRef,
    setOptionType,
    setIsListOpen,
  )

  const handleSelectVariable = useCallback(
    (insert: string) => {
      if (!value) {
        return
      }
      setOptionType(null)
      setIsListOpen(false)

      // update할 단어 첫번째 문자의 index를 추출한다.
      const searchRangeString = value.substring(0, cursorPosition.current)
      const lastIndex = searchRangeString.lastIndexOf(originalWord.current)
      if (lastIndex === -1) {
        return value
      }

      let beforeString = value.substring(0, lastIndex)

      const originalWordSplitStruct = originalWord.current.split('.')
      if (originalWordSplitStruct.length > 1) {
        originalWordSplitStruct.pop()
        beforeString += originalWordSplitStruct.join('.') + '.'
      }

      const afterString = value.substring(
        lastIndex + originalWord.current.length,
      )

      onChange && onChange(name, beforeString + insert + afterString)
    },
    [name, onChange, value],
  )

  const handleSelectOption = useCallback(
    (select: string) => {
      setOptionType(null)
      setIsListOpen(false)
      onChange && onChange(name, select)
    },
    [name, onChange],
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const search = e.target.value

      setOptionType(search && options ? 'option' : null)
      setIsListOpen(true)

      cursorPosition.current = inputRef.current?.selectionStart || search.length
      const searchKeyword = extractKeyword(search, cursorPosition.current)
      originalWord.current = searchKeyword

      if (onChange) {
        onChange(name, search)
      }
      if (onValueChange) {
        onValueChange(name, searchKeyword)
      }

      if (search === '') {
        setOptionType(null)
        setIsListOpen(false)
      }
    },
    [name, onChange, onValueChange, options],
  )

  const handleClick = useCallback(() => {
    if (isListOpen) {
      setOptionType('select')
      return
    }
    setOptionType((state) => (state !== 'select' ? 'select' : null))
    setIsListOpen((prev) => !prev)
  }, [isListOpen])

  return (
    <Command>
      <AutocompleteInput
        {...props}
        ref={inputRef}
        buttonRef={inputButtonRef}
        hasSelectOptions={!!selectOptions?.length}
        onChange={handleChange}
        onClick={handleClick}
        onBlur={() => setIsListOpen(false)}
      />
      {isListOpen && (
        <AutocompleteList
          {...props}
          ref={listRef}
          input={inputRef.current}
          optionType={optionType}
          onSelectVariable={handleSelectVariable}
          onSelectOption={handleSelectOption}
        />
      )}
    </Command>
  )
}
