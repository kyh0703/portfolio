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
  DISCONNECT_TYPE_OPTIONS,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { DisconnectInfo } from '@/models/property/telephony'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function BeginnerDisconnectInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues('info') as DisconnectInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Disconnect Type</h3>
        <Select
          value={info?.type}
          onValueChange={(value) => setValue('info.type', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DISCONNECT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.info?.type && (
          <span className="error-msg">{errors.info.type.message}</span>
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
    </div>
  )
}
