'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { ChangeServiceInfo } from '@/models/property/flow'
import { useQueryVariables } from '@/services/variable/queries/use-query-variables'
import { useSuspenseQuery } from '@tanstack/react-query'
import { NodePropertyTabProps } from '../node-property/types'

export default function ServiceInfoTab(props: NodePropertyTabProps) {
  const { subFlowId } = props
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as ChangeServiceInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const { data: variableOptions } = useSuspenseQuery(
    useQueryVariables(subFlowId),
  )

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Service</h3>
        <Autocomplete
          name="info.service"
          value={info?.service}
          options={options}
          selectOptions={
            // TODO: 운영관리와 연동된 데이터가 있다면 등록된 CTI Adaptor 리스트를 리스팅
            []
          }
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.service && (
          <span className="error-msg">{errors.info.service.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>ANI</h3>
        <Autocomplete
          name="info.ani"
          value={info?.ani}
          options={options}
          selectOptions={variableOptions}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.ani && (
          <span className="error-msg">{errors.info.ani.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>DNIS</h3>
        <Autocomplete
          name="info.dnis"
          value={info?.dnis}
          options={options}
          selectOptions={variableOptions}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.dnis && (
          <span className="error-msg">{errors.info.dnis.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>User Data</h3>
        <Autocomplete
          name="info.usrData"
          value={info?.usrData}
          options={options}
          selectOptions={variableOptions}
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="info.condition"
          value={info?.condition}
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
