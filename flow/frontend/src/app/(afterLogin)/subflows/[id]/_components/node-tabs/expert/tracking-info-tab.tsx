'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineTracking } from '@/models/define'
import { TrackingInfo } from '@/models/property/tracking/tracking-info'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { NodePropertyTabProps } from '../../node-properties/types'
import { useEffect } from 'react'

export default function TrackingInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as TrackingInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const { data: tracks } = useSuspenseQuery({
    ...useQueryDefines<DefineTracking>('track'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    if (info?.id) {
      const selectedTrack = tracks.find((track) => track.defineId === info.id)
      if (!selectedTrack) return
      setValue('info.name', selectedTrack.property.name)
    }
  }, [info?.id, setValue, tracks])

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-3">
        <div className="flex gap-3">
          <Checkbox
            id="pointFlag"
            checked={info?.pointFlag}
            onCheckedChange={(checked) => setValue('info.pointFlag', !!checked)}
          />
          <Label htmlFor="pointFlag">Tracking Point Flag</Label>
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="encrypt"
            checked={info?.encrypt}
            onCheckedChange={(checked) => setValue('info.encrypt', !!checked)}
          />
          <Label htmlFor="encrypt">Encryption Value1</Label>
        </div>
      </div>
      <div className="space-y-3">
        <h3>Track ID</h3>
        <Autocomplete
          name="info.id"
          value={info?.id}
          options={options}
          selectOptions={tracks.map((track) => track.defineId)}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.id && (
          <span className="error-msg">{errors.info.id.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Track Name</h3>
        <Input value={info?.name} readOnly={true} onChange={() => {}} />
      </div>
      <div className="space-y-3">
        <h3>Track Value</h3>
        <Autocomplete
          name="info.value"
          value={info?.value}
          rows={3}
          options={options}
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
