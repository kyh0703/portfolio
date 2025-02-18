'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import { CHOICE_CALL_OPTIONS, TIMEOUT_OPTIONS_30 } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { type DefineMent } from '@/models/define'
import { PacketJsonInfo } from '@/models/property/packet'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function PacketJsonInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const packetInfo = getValues(props.tabName) as PacketJsonInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const [mentDesc, setMentDesc] = useState<string>()

  const { data: ments } = useSuspenseQuery({
    ...useQueryDefines<DefineMent>('ment'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    const ment = ments?.find((ment) => ment.defineId === packetInfo?.bgm)
    setMentDesc(ment?.property.desc || '')
  }, [ments, packetInfo?.bgm])

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="flex gap-3">
        <Checkbox
          id="requestOnly"
          checked={packetInfo?.requestOnly}
          onCheckedChange={(checked) =>
            setValue('packetInfo.requestOnly', !!checked)
          }
        />
        <Label htmlFor="requestOnly">Request Only</Label>
      </div>
      <div className="space-y-3">
        <h3>Name</h3>
        <Autocomplete
          name="packetInfo.name"
          value={packetInfo?.name}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.packetInfo?.name && (
          <span className="error-msg">{errors.packetInfo.name.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Transaction ID</h3>
        <Autocomplete
          name="packetInfo.transId"
          value={packetInfo?.transId}
          options={options}
          selectOptions={
            // TODO: 운영관리 TB Adaptor 목록과 연동된다면 콤보박스 버튼을 누르면 리스팅한다.
            []
          }
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.packetInfo?.transId && (
          <span className="error-msg">{errors.packetInfo.transId.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Timeout</h3>
        <Autocomplete
          name="packetInfo.timeout"
          value={packetInfo?.timeout}
          options={options}
          selectOptions={TIMEOUT_OPTIONS_30}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.packetInfo?.timeout && (
          <span className="error-msg">{errors.packetInfo.timeout.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Choice Call, for BGM</h3>
        <Autocomplete
          name="packetInfo.choiceCall"
          value={packetInfo?.choiceCall}
          options={options}
          selectOptions={CHOICE_CALL_OPTIONS}
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
      <div className="space-y-3">
        <h3>BGM</h3>
        <Autocomplete
          name="packetInfo.bgm"
          value={packetInfo?.bgm}
          options={options}
          selectOptions={ments.map((ment) => ({
            label: `'${ment.defineId}' - "${ment.property.desc}"`,
            value: `'${ment.defineId}'`,
          }))}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        <Input value={mentDesc} readOnly={true} onChange={() => {}} />
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="packetInfo.condition"
          value={packetInfo?.condition}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.packetInfo?.condition && (
          <span className="error-msg">
            {errors.packetInfo.condition.message}
          </span>
        )}
      </div>
    </div>
  )
}
