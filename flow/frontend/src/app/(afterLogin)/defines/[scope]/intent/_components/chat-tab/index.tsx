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
import { CHAT_INFO_NLU_CATEGORY_OPTIONS } from '@/constants/options'
import type { EntityList } from '@/models/define'
import { Separator } from '@/ui/separator'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import ChatGrid from '../chat-grid'

export default function ChatTab() {
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<EntityList>()
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    const category = getValues(`chatInfo.output.category.${tabValue}`)
    setValue(`chatInfo.output.category.${tabValue}`, category)
  }, [getValues, setValue, tabValue])

  const handleValueChange = (value: string) => {
    const index = CHAT_INFO_NLU_CATEGORY_OPTIONS.findIndex(
      (category) => category === value,
    )
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
              {CHAT_INFO_NLU_CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <h3>Expression Code</h3>
          <FormAutocomplete
            control={control}
            name={`chatInfo.output.category.${tabValue}.expressionCode`}
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
            <FormInput control={control} name="chatInfo.input.timeout" />
            <span>(Second)</span>
            {errors.chatInfo?.input?.timeout && (
              <span className="error-msg">
                {errors.chatInfo.input.timeout.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
