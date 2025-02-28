'use client'

import useAutocompleteEvent from '@/hooks/use-autocomplete-event'
import { extractKeyword } from '@/utils'
import { useCallback, useRef, useState } from 'react'
import {
  useForm,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { Command } from '../command'
import { Form, FormControl, FormField } from '../form'
import FormAutocompleteInput from './input'
import FormAutocompleteList from './list'

export type Option =
  | (Record<'label', string> & Record<'value', string>)
  | string

type FormAutocompleteProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  options?: string[]
  selectOptions?: Option[]
  placeholder?: string
  rows?: number
  disabled?: boolean
  readonly?: boolean
  autoFocus?: boolean
  onValueChange?: (name: string, keyword: string) => void
}

export default function FormAutocomplete<T extends FieldValues>(
  props: FormAutocompleteProps<T>,
) {
  const { control, name, options, selectOptions, onValueChange } = props

  const [optionType, setOptionType] = useState<'option' | 'select' | null>(null)
  const [isListOpen, setIsListOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const inputButtonRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const cursorPosition = useRef(0)
  const originalWord = useRef('')

  const methods = useForm<T>()

  useAutocompleteEvent(
    isListOpen,
    inputButtonRef,
    listRef,
    setOptionType,
    setIsListOpen,
  )

  const handleSelectVariable = useCallback(
    (text: string, select: string, onChange: (...event: any) => void) => {
      setOptionType(null)
      setIsListOpen(false)

      // update할 단어 첫번째 문자의 index를 추출한다.
      const searchRangeString = text.substring(0, cursorPosition.current)
      const lastIndex = searchRangeString.lastIndexOf(originalWord.current)
      if (lastIndex === -1) {
        return text
      }

      let beforeString = text.substring(0, lastIndex)

      const originalWordSplitStruct = originalWord.current.split('.')
      if (originalWordSplitStruct.length > 1) {
        originalWordSplitStruct.pop()
        beforeString += originalWordSplitStruct.join('.') + '.'
      }

      const afterString = text.substring(
        lastIndex + originalWord.current.length,
      )
      onChange(beforeString + select + afterString)
    },
    [],
  )

  const handleSelectOption = useCallback(
    (select: string, onChange: (...event: any) => void) => {
      setOptionType(null)
      setIsListOpen(false)

      onChange(select)
    },
    [],
  )

  const handleChange = useCallback(
    (text: string, onChange: (...event: any) => void) => {
      setOptionType(text && options ? 'option' : null)
      setIsListOpen(true)
      onChange(text)

      cursorPosition.current = inputRef.current?.selectionStart || text.length
      const searchKeyword = extractKeyword(text, cursorPosition.current)
      originalWord.current = searchKeyword

      if (onValueChange) {
        onValueChange(name, searchKeyword)
      }
    },
    [name, onValueChange, options],
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
    <Form {...methods}>
      <FormField
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <FormControl>
            <Command shouldFilter={false}>
              <FormAutocompleteInput
                {...props}
                ref={inputRef}
                buttonRef={inputButtonRef}
                value={value}
                hasSelectOptions={!!selectOptions?.length}
                onClick={handleClick}
                onChange={handleChange}
                onBlur={() => setIsListOpen(false)}
                onRenderChange={onChange}
              />
              {isListOpen && (
                <FormAutocompleteList
                  {...props}
                  ref={listRef}
                  value={value}
                  input={inputRef.current}
                  optionType={optionType}
                  onSelectVariable={handleSelectVariable}
                  onSelectOption={handleSelectOption}
                  onRenderChange={onChange}
                />
              )}
            </Command>
          </FormControl>
        )}
      />
    </Form>
  )
}
