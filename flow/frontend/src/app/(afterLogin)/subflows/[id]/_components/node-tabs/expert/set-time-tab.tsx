'use client'

import Autocomplete from '@/app/_components/autocomplete'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { TIMER_TYPE_OPTIONS } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { type TimeInfo } from '@/models/property/flow'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function SetTimeTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const timeInfo = getValues(props.tabName) as TimeInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Sleep Time</h3>
        <div className="flex gap-1.5">
          <div className="flex-grow">
            <div>
              <Autocomplete
                name="timeInfo.sleepTime"
                value={timeInfo?.sleepTime}
                options={options}
                onChange={setValue}
                onValueChange={onValueChange}
              />
              {errors.timeInfo?.sleepTime && (
                <span className="error-msg">
                  {errors.timeInfo.sleepTime.message}
                </span>
              )}
            </div>
          </div>
          <div>
            <Select
              value={timeInfo?.kind}
              onValueChange={(value) => setValue('timeInfo.kind', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMER_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.timeInfo?.kind && (
              <span className="error-msg">{errors.timeInfo.kind.message}</span>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="timeInfo.condition"
          value={timeInfo?.condition}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.timeInfo?.condition && (
          <span className="error-msg">{errors.timeInfo.condition.message}</span>
        )}
      </div>
    </div>
  )
}
