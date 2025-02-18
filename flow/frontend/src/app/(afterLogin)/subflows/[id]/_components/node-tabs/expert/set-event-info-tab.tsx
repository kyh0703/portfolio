'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { SetEventInfo } from '@/models/property/event'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function SetEventInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as SetEventInfo | undefined
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
        <h3>Event ID</h3>
        <Autocomplete
          name="info.eventId"
          value={info?.eventId}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.eventId && (
          <span className="error-msg">{errors.info.eventId.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Data</h3>
        <Autocomplete
          name="info.data"
          value={info?.data}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.data && (
          <span className="error-msg">{errors.info.data.message}</span>
        )}
      </div>
    </div>
  )
}
