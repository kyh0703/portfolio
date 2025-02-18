'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function BeginnerReturnInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const value = getValues(props.tabName) as string | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col items-start space-y-3 p-6">
      <h3>Return Value</h3>
      <Autocomplete
        name="value"
        value={value}
        options={options}
        onChange={setValue}
        onValueChange={onValueChange}
      />
      {errors.value && (
        <span className="error-msg">{errors.value.message}</span>
      )}
    </div>
  )
}
