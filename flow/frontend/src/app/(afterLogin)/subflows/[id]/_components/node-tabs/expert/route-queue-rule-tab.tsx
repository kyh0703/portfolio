'use client'

import { Input } from '@/app/_components/input'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import { RouteQueueInfo } from '@/models/property/route'
import { NodePropertyTabProps } from '../../node-properties/types'
import useAutocomplete from '@/hooks/use-autocomplete'
import Autocomplete from '@/app/_components/autocomplete'

export default function RouteQueueRuleTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const routeInfo = getValues(props.tabName) as RouteQueueInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Route Priority</h3>
        <Autocomplete
          name="routeInfo.priority"
          value={routeInfo?.priority}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.routeInfo?.priority && (
          <span className="error-msg">{errors.routeInfo.priority.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Timeout</h3>
        <div className="flex items-center space-x-3">
          <Autocomplete
            name="routeInfo.timeout"
            value={routeInfo?.timeout}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          <h3>(s)</h3>
        </div>
        {errors.routeInfo?.timeout && (
          <span className="error-msg">{errors.routeInfo.timeout.message}</span>
        )}
      </div>
    </div>
  )
}
