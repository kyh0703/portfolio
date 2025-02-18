'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Input } from '@/app/_components/input'
import PlayButton from '@/app/_components/play-button'
import { TIMEOUT_OPTIONS_30 } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineMent } from '@/models/define'
import { WaitEventInfo } from '@/models/property/event'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function WaitEventInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as WaitEventInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const [mentDesc, setMentDesc] = useState<string>()

  const { data: ments } = useSuspenseQuery({
    ...useQueryDefines<DefineMent>('ment'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    const ment = ments.find((ment) => `'${ment.defineId}'` === info?.bgm)
    setMentDesc(ment?.property.desc || '')
  }, [info?.bgm, ments])

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Event ID</h3>
        <Autocomplete
          name="info.eventId"
          value={info?.eventId}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.eventId && (
          <span className="error-msg">{errors.info.eventId.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Data</h3>
        <Autocomplete
          name="info.data"
          value={info?.data}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.data && (
          <span className="error-msg">{errors.info.data.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Timeout, -1(waiting forever)</h3>
        <div className="flex items-center space-x-3">
          <Autocomplete
            name="info.timeout"
            value={info?.timeout}
            options={options}
            selectOptions={TIMEOUT_OPTIONS_30}
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
        <h3>BGM</h3>
        <div className="flex gap-1.5">
          <Autocomplete
            name="info.bgm"
            value={info?.bgm}
            options={options}
            selectOptions={ments.map((ment) => ({
              label: `'${ment.defineId}' - "${ment.property.desc}"`,
              value: `'${ment.defineId}'`,
            }))}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          <PlayButton disabled={!info?.bgm} />
        </div>
        <Input value={mentDesc} readOnly={true} onChange={() => {}} />
      </div>
    </div>
  )
}
