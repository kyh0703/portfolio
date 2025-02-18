'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { InboundInfo } from '@/models/property/telephony'
import { useQueryVariables } from '@/services/variable/queries/use-query-variables'
import { useSuspenseQuery } from '@tanstack/react-query'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function BeginnerInboundInfoTab(props: NodePropertyTabProps) {
  const { subFlowId } = props
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const inboundInfo = getValues('inboundInfo') as InboundInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const { data: variableOptions } = useSuspenseQuery(
    useQueryVariables(subFlowId),
  )

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>ANI</h3>
        <Autocomplete
          name="inboundInfo.ani"
          value={inboundInfo?.ani}
          options={options}
          selectOptions={variableOptions}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.inboundInfo?.ani && (
          <span className="error-msg">{errors.inboundInfo.ani.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>DNIS</h3>
        <Autocomplete
          name="inboundInfo.dnis"
          value={inboundInfo?.dnis}
          options={options}
          selectOptions={variableOptions}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.inboundInfo?.dnis && (
          <span className="error-msg">{errors.inboundInfo.dnis.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>User Data</h3>
        <Autocomplete
          name="inboundInfo.usrData"
          value={inboundInfo?.usrData}
          options={options}
          selectOptions={variableOptions}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.inboundInfo?.usrData && (
          <span className="error-msg">
            {errors.inboundInfo.usrData.message}
          </span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Trunk User Data</h3>
        <Autocomplete
          name="inboundInfo.trkData"
          value={inboundInfo?.trkData}
          options={options}
          selectOptions={variableOptions}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.inboundInfo?.trkData && (
          <span className="error-msg">
            {errors.inboundInfo.trkData.message}
          </span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Ring Time</h3>
        <div className="flex items-center gap-1.5">
          <Input
            value={inboundInfo?.ringTime}
            onChange={(event) =>
              setValue('inboundInfo.ringTime', event.target.value)
            }
          />
          ms/s
        </div>
        {errors.inboundInfo?.ringTime && (
          <span className="error-msg">
            {errors.inboundInfo.ringTime.message}
          </span>
        )}
        <div className="flex gap-3">
          <Checkbox
            id="cdrInit"
            checked={inboundInfo?.cdrInit}
            onCheckedChange={(checked) =>
              setValue('inboundInfo.cdrInit', !!checked)
            }
          />
          <Label htmlFor="cdrInit">CDR Initialize</Label>
        </div>
      </div>
    </div>
  )
}
