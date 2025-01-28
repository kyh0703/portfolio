'use client'

import Autocomplete from '@/app/_components/autocomplete'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { ACD_KIND_OPTIONS, SKILL_LEVEL_OPTIONS } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { RouteACDInfo } from '@/models/property/route'
import { NodePropertyTabProps } from '../node-property/types'

export default function RouteACDTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const routeInfo = getValues(props.tabName) as RouteACDInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>ACD Kind</h3>
        <Select
          value={routeInfo?.kind}
          onValueChange={(value) => setValue('routeInfo.kind', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACD_KIND_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        <h3>ACD Target</h3>
        <Autocomplete
          name="routeInfo.target"
          value={routeInfo?.target}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.routeInfo?.target && (
          <span className="error-msg">{errors.routeInfo.target.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Route Type</h3>
        <Select
          value={routeInfo?.routeType}
          onValueChange={(value) => setValue('routeInfo.routeType', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SKILL_LEVEL_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.routeInfo?.routeType && (
          <span className="error-msg">
            {errors.routeInfo.routeType.message}
          </span>
        )}
      </div>
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
