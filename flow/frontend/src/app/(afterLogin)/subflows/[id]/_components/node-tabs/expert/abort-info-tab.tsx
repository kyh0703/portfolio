'use client'

import Autocomplete from '@/app/_components/autocomplete'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import {
  CHOICE_CALL_OPTIONS,
  MEDIA_TYPE_OPTIONS,
  type MediaType,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { AbortInfo } from '@/models/property/telephony'
import type { NodePropertyTabProps } from '../../node-properties/types'

export default function AbortInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const data = getValues(props.tabName) as AbortInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Line No.</h3>
        <Autocomplete
          name="info.lineNo"
          value={data?.lineNo}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.lineNo && (
          <span className="error-msg">{errors.info.lineNo.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Media Type</h3>
        <Select
          value={data?.mediaType}
          onValueChange={(value) =>
            setValue('info.mediaType', value as MediaType)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MEDIA_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.info?.mediaType && (
          <span className="error-msg">{errors.info.mediaType.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Choice Call</h3>
        <Autocomplete
          name="info.choiceCall"
          value={data?.choiceCall}
          options={options}
          selectOptions={CHOICE_CALL_OPTIONS}
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
    </div>
  )
}
