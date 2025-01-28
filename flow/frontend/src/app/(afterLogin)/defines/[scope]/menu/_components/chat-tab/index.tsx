'use client'

import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormInput from '@/app/_components/form-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { Separator } from '@/ui/separator'
import type { DefineMenu } from '@/models/define'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import ChatGrid from '../chat-grid'

const categories = [
  'CAPTION',
  'CHOICE',
  'TIMEOUT',
  'INPUT',
  'RETRY',
  'VR_TIMEOUT',
  'VR_INPUT',
  'VR_RETRY',
  'BLOCK',
]

export default function ChatTab() {
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<DefineMenu>()
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    const category = getValues(`chat.output.category.${tabValue}`)
    setValue(`chat.output.category.${tabValue}`, category)
  }, [getValues, setValue, tabValue])

  const handleValueChange = (value: string) => {
    const index = categories.findIndex((category) => category === value)
    setTabValue(index)
  }

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col space-y-6 p-6">
        <div className="flex h-full flex-col space-y-3">
          <h2>Output</h2>
          <h3>Sentence Category</h3>
          <Select defaultValue="" onValueChange={handleValueChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <h3>Expression Code</h3>
          <FormAutocomplete
            control={control}
            name={`chat.output.category.${tabValue}.expressionCode`}
            selectOptions={
              // TODO: Chat 서버에 미리 정의 된 Chat Code와 연동이 가능하다면 Code를 리스팅한다
              []
            }
          />
          <ChatGrid tabValue={tabValue} />
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="w-full space-y-6 p-6">
        <div className="space-y-3">
          <h2>Input</h2>
          <h3>Timeout</h3>
          <div className="flex items-center gap-3">
            <FormInput control={control} name="chat.input.timeout" />
            <span>(Second)</span>
            {errors.chat?.input?.timeout && (
              <span className="error-msg">
                {errors.chat.input.timeout.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
