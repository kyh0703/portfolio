'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import Label from '@/app/_components/label'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { EnvData } from '@/models/property/flow/user-env'
import { NodePropertyTabProps } from '../node-property/types'

export default function EnvironmentDataTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const envData = getValues(props.tabName) as EnvData | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Name</h3>
        <Autocomplete
          name="envData.name"
          value={envData?.name}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.envData?.name && (
          <span className="error-msg">{errors.envData.name.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>File</h3>
        <Autocomplete
          name="envData.file"
          value={envData?.file}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.envData?.file && (
          <span className="error-msg">{errors.envData.file.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Service</h3>
        <Autocomplete
          name="envData.service"
          value={envData?.service}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.envData?.service && (
          <span className="error-msg">{errors.envData.service.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Value</h3>
        <Autocomplete
          name="envData.value"
          value={envData?.value}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.envData?.value && (
          <span className="error-msg">{errors.envData.value.message}</span>
        )}
      </div>
      <div className="flex flex-col space-y-3">
        <h3>Default</h3>
        <Autocomplete
          name="envData.default"
          value={envData?.default}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        <div className="flex gap-3">
          <Checkbox
            id="write"
            checked={envData?.write}
            onCheckedChange={(checked) => setValue('envData.write', !!checked)}
          />
          <Label htmlFor="write">Write</Label>
        </div>
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="envData.condition"
          value={envData?.condition}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.envData?.condition && (
          <span className="error-msg">{errors.envData.condition.message}</span>
        )}
      </div>
    </div>
  )
}
