'use client'

import Autocomplete from '@/app/_components/autocomplete'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { CHOICE_CALL_OPTIONS, SWITCH_MODE_OPTIONS } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { SwitchInfo } from '@/models/property/common/switch-info'
import { NodePropertyTabProps } from '../node-property/types'

export default function SwitchInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as SwitchInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>To</h3>
        <Autocomplete
          name="info.to"
          value={info?.to}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.to && (
          <span className="error-msg">{errors.info.to.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Mode</h3>
        <Select
          value={info?.mode}
          onValueChange={(value) => setValue('info.mode', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SWITCH_MODE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
    </div>
  )
}
