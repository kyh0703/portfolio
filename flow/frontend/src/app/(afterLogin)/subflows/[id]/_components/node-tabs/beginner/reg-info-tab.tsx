'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { RegistServerInfo } from '@/models/property/iweb'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function BeginnerRegInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as RegistServerInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Transaction ID</h3>
        <Autocomplete
          name="info.transId"
          value={info?.transId}
          options={options}
          selectOptions={
            // 운영관리에(SWAT 등) 등록된 ICM Adaptor 목록
            []
          }
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.transId && (
          <span className="error-msg">{errors.info.transId.message}</span>
        )}
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
