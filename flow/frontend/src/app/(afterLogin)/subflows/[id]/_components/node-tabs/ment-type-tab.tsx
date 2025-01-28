'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Input } from '@/app/_components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { TYPE_ID_OPTIONS } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { MentType } from '@/models/property/telephony'
import { NodePropertyTabProps } from '../node-property/types'
import { useEffect, useMemo } from 'react'
import { useQueryOption } from '@/services/option/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { MultiMentOption } from '@/models/manage'

export default function MentTypeTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const mentType = getValues(props.tabName) as MentType | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const { data } = useSuspenseQuery(useQueryOption())

  const mentTypes = useMemo(() => {
    if (!data) return []
    const tempMentTypes = TYPE_ID_OPTIONS.map((type) => {
      if (type === '\u00A0') return { label: type, value: type }
      return {
        label: `${type} - ${data.multiMent[type.toLowerCase() as keyof MultiMentOption]}`,
        value: type,
      }
    })
    return tempMentTypes
  }, [data])

  useEffect(() => {
    if (mentType?.typeId) {
      const key = mentType.typeId.toLowerCase()
      const desc =
        key in data.multiMent
          ? data.multiMent[key as keyof MultiMentOption]
          : ''
      setValue('mentType.desc', desc)
    } else {
      setValue('mentType.desc', '')
    }
  }, [mentType, mentType?.typeId, data?.multiMent, setValue])

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="flex flex-col items-start space-y-3">
        <h3>Type ID</h3>
        <Select
          value={mentType?.typeId === '' ? '\u00A0' : mentType?.typeId}
          onValueChange={(value) => {
            setValue('mentType.typeId', value === '\u00A0' ? '' : value)
          }}
        >
          <SelectTrigger>
            <span>{mentType?.typeId}</span>
          </SelectTrigger>
          <SelectContent>
            {mentTypes?.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input value={mentType?.desc} readOnly={true} onChange={() => {}} />
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="mentType.condition"
          value={mentType?.condition}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.mentType?.condition && (
          <span className="error-msg">{errors.mentType.condition.message}</span>
        )}
      </div>
    </div>
  )
}
