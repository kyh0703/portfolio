'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function ConditionTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const condition = getValues('condition') as string | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-3 p-6">
      <h3>Condition Expression</h3>
      <Autocomplete
        name="condition"
        value={condition}
        rows={15}
        options={options}
        onChange={setValue}
        onValueChange={onValueChange}
      />
      {errors.condition && (
        <span className="error-msg">{errors.condition.message}</span>
      )}
    </div>
  )
}
