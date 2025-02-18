'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { CHOICE_CALL_OPTIONS } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { PushToneInfo } from '@/models/property/telephony'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function ToneInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as PushToneInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Tone String</h3>
        <Autocomplete
          name="info.toneString"
          value={info?.toneString}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.toneString && (
          <span className="error-msg">{errors.info.toneString.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Interdelay</h3>
        <div className="flex items-center space-x-3">
          <Autocomplete
            name="info.interDelay"
            value={info?.interDelay}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          <h3>(ms)</h3>
        </div>
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
        <h3>Condition</h3>
        <Autocomplete
          name="info.condition"
          value={info?.condition}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.condition && (
          <span className="error-msg">{errors.info.condition.message}</span>
        )}
      </div>
    </div>
  )
}
