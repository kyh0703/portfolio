'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import Label from '@/app/_components/label'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { OutboundInfo } from '@/models/property/telephony'
import { useQueryVariables } from '@/services/variable/queries/use-query-variables'
import { useSuspenseQuery } from '@tanstack/react-query'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function BeginnerOutboundIntoTab(props: NodePropertyTabProps) {
  const { subFlowId, tabName } = props
  const { getValues, setValue } = useNodePropertiesContext()
  const outboundInfo = getValues(tabName) as OutboundInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const { data: variableOptions } = useSuspenseQuery(
    useQueryVariables(subFlowId),
  )

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>User Data</h3>
        <Autocomplete
          name="outboundInfo.usrData"
          value={outboundInfo?.usrData}
          options={options}
          selectOptions={variableOptions}
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
      <div className="space-y-3">
        <h3>Caller Line No.</h3>
        <Autocomplete
          name="outboundInfo.callLine"
          value={outboundInfo?.callLine}
          options={options}
          selectOptions={variableOptions}
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
      <div className="space-y-3">
        <h3>DN Group Name</h3>
        <Autocomplete
          name="outboundInfo.dnGroup"
          value={outboundInfo?.dnGroup}
          options={options}
          selectOptions={
            []
            // TODO: 운영관리와 연동된 DNGROUP을 리스팅 함
          }
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
      <div>
        <div className="flex gap-3">
          <Checkbox
            id="cdrInit"
            checked={outboundInfo?.cdrInit}
            onCheckedChange={(checked) =>
              setValue('outboundInfo.cdrInit', !!checked)
            }
          />
          <Label htmlFor="cdrInit">CDR Initialize</Label>
        </div>
      </div>
    </div>
  )
}
