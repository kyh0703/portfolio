'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { WaitWebInboundInfo } from '@/models/property/iweb'
import { NodePropertyTabProps } from '../node-property/types'

export default function WaitWebInboundTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as WaitWebInboundInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Timeout</h3>
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
