'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { CHOICE_CALL_OPTIONS, DETECT_TYPE_OPTIONS } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { ToneDetectInfo } from '@/models/property/telephony'
import { NodePropertyTabProps } from '../node-property/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'

export default function DetectInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as ToneDetectInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Detect Type</h3>
        <Select
          value={info?.detectType}
          onValueChange={(value) => setValue('info.detectType', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DETECT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.info?.detectType && (
          <span className="error-msg">{errors.info.detectType.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Choice Call</h3>
        <Autocomplete
          name="info.choiceCall"
          value={info?.choiceCall}
          options={options}
          selectOptions={CHOICE_CALL_OPTIONS}
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
      <div className="space-y-3">
        <h3>Tone Timeout</h3>
        <div className="flex items-center space-x-3">
          <Autocomplete
            name="info.timeout"
            value={info?.timeout}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          <h3>(ms)</h3>
        </div>
        {errors.info?.timeout && (
          <span className="error-msg">{errors.info.timeout.message}</span>
        )}
      </div>
    </div>
  )
}
