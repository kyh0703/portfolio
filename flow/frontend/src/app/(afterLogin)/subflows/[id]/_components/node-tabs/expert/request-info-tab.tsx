'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Input } from '@/app/_components/input'
import PlayButton from '@/app/_components/play-button'
import { CHOICE_CALL_OPTIONS, TIMEOUT_OPTIONS_30 } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineMent } from '@/models/define'
import { RequestInfo } from '@/models/property/packet'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function RequestInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const requestInfo = getValues(props.tabName) as RequestInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const [mentDesc, setMentDesc] = useState<string>()

  const { data: ments } = useSuspenseQuery({
    ...useQueryDefines<DefineMent>('ment'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    const ment = ments.find((ment) => `'${ment.defineId}'` === requestInfo?.bgm)
    setMentDesc(ment?.property.desc || '')
  }, [ments, requestInfo?.bgm])

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Name</h3>
        <Autocomplete
          name="requestInfo.name"
          value={requestInfo?.name}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.requestInfo?.name && (
          <span className="error-msg">{errors.requestInfo.name.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Timeout</h3>
        <Autocomplete
          name="requestInfo.timeout"
          value={requestInfo?.timeout}
          options={options}
          selectOptions={TIMEOUT_OPTIONS_30}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.requestInfo?.timeout && (
          <span className="error-msg">
            {errors.requestInfo.timeout.message}
          </span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Choice Call, for BGM</h3>
        <Autocomplete
          name="requestInfo.choiceCall"
          value={requestInfo?.choiceCall}
          options={options}
          selectOptions={CHOICE_CALL_OPTIONS}
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
      <div className="space-y-3">
        <h3>BGM</h3>
        <div className="flex gap-1.5">
          <Autocomplete
            name="requestInfo.bgm"
            value={requestInfo?.bgm}
            options={options}
            selectOptions={ments.map((ment) => ({
              label: `'${ment.defineId}' - "${ment.property.desc}"`,
              value: `'${ment.defineId}'`,
            }))}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          <PlayButton disabled={!requestInfo?.bgm} />
        </div>
        <Input value={mentDesc} readOnly={true} onChange={() => {}} />
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="requestInfo.condition"
          value={requestInfo?.condition}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.requestInfo?.condition && (
          <span className="error-msg">
            {errors.requestInfo.condition.message}
          </span>
        )}
      </div>
    </div>
  )
}
