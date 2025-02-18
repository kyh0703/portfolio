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
import {
  AGENT_TYPE_OPTIONS,
  CHOICE_CALL_OPTIONS,
  FORMAT_OPTIONS,
  TIMEOUT_OPTIONS_10,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { TransferInfo } from '@/models/property/telephony'
import { useQueryVariables } from '@/services/variable/queries/use-query-variables'
import { useSuspenseQuery } from '@tanstack/react-query'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function TransferInfoTab(props: NodePropertyTabProps) {
  const { subFlowId, tabName } = props
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(tabName) as TransferInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const { data: variableOptions } = useSuspenseQuery(
    useQueryVariables(subFlowId),
  )

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
        <h3>Timeout</h3>
        <Autocomplete
          name="info.timeout"
          value={info?.timeout}
          options={options}
          selectOptions={TIMEOUT_OPTIONS_10}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.timeout && (
          <span className="error-msg">{errors.info.timeout.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>User Data</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Autocomplete
              name="info.usrData"
              value={info?.usrData}
              options={options}
              selectOptions={variableOptions}
              onChange={setValue}
              onValueChange={onValueChange}
            />
          </div>
          <div>
            <Select
              value={info?.format}
              onValueChange={(value) => setValue('info.format', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <div className="flex gap-3">
          <Checkbox
            id="switch"
            checked={info?.switch}
            onCheckedChange={(checked) => setValue('info.switch', !!checked)}
          />
          <Label htmlFor="switch">Switch between call center</Label>
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="hold"
            checked={info?.hold}
            onCheckedChange={(checked) => setValue('info.hold', !!checked)}
          />
          <Label htmlFor="hold">Hold Call</Label>
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="agent"
            checked={info?.agent}
            onCheckedChange={(checked) => setValue('info.agent', !!checked)}
          />
          <Label htmlFor="agent">Agent Call</Label>
        </div>
      </div>
      <div className="space-y-3">
        <h3>Agent Type</h3>
        <Select
          value={info?.agentType}
          onValueChange={(value) => setValue('info.agentType', value)}
          disabled={!info?.agent}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AGENT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
