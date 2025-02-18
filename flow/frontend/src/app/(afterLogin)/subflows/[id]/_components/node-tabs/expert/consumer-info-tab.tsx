'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import Label from '@/app/_components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { CONSUMER_OPTIONS } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { ConsumerMonitInfo } from '@/models/property/tracking'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function ConsumerInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as ConsumerMonitInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="flex gap-3">
        <Checkbox
          id="easyCheck"
          checked={info?.easyCheck}
          onCheckedChange={(checked) => setValue('info.easyCheck', !!checked)}
        />
        <Label htmlFor="easyCheck">Easy Check</Label>
      </div>
      <div className="space-y-3">
        <h3>Type</h3>
        <Select
          value={info?.type}
          onValueChange={(value) => setValue('info.type', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONSUMER_OPTIONS.map((option) => (
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
        <h3>Level</h3>
        <Autocomplete
          name="info.level"
          value={info?.level}
          rows={15}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="info.condition"
          value={info?.condition}
          rows={15}
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
