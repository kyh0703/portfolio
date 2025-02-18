'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { OpenVRInfo } from '@/models/property/vr'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function OpenInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as OpenVRInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Timeout</h3>
        <div className="flex items-center space-x-3">
          <Autocomplete
            name="info.timeout"
            value={info?.timeout}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          <h3>(s)</h3>
        </div>
        {errors.info?.timeout && (
          <span className="error-msg">{errors.info.timeout.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>STT Name</h3>
        <Autocomplete
          name="info.sttName"
          value={info?.sttName}
          options={options}
          selectOptions={
            // TODO: 운영관리에(SWAT 등) 등록된 STT 서버 목록
            []
          }
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.sttName && (
          <span className="error-msg">{errors.info.sttName.message}</span>
        )}
      </div>
    </div>
  )
}
