'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineTracking } from '@/models/define'
import type { Tracking } from '@/models/property/common'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function TrackingTab(props: NodePropertyTabProps) {
  const { nodeType, tabName } = props
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const tracking = getValues(tabName) as Tracking | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const { data: tracks } = useSuspenseQuery({
    ...useQueryDefines<DefineTracking>('track'),
    select: (data) =>
      removeDuplicateDefines(data).filter(
        (track) =>
          track.property.type === nodeType || track.property.type === '',
      ),
  })

  useEffect(() => {
    const trackingId = tracking?.info.id

    if (trackingId) {
      const selectedTrack = tracks.find(
        (track) => track.defineId === trackingId,
      )
      if (selectedTrack) {
        setValue('tracking.info.name', selectedTrack.property.name)
        return
      }
    }

    setValue('tracking.info.name', '')
  }, [setValue, tracking?.info.id, tracks])

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-3">
        <div className="flex gap-3">
          <Checkbox
            id="enable"
            checked={tracking?.enable}
            onCheckedChange={(checked) =>
              setValue('tracking.enable', !!checked)
            }
          />
          <Label htmlFor="enable">Check Tracking</Label>
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="pointFlag"
            checked={tracking?.info.pointFlag}
            disabled={!tracking?.enable}
            onCheckedChange={(checked) =>
              setValue('tracking.info.pointFlag', !!checked)
            }
          />
          <Label htmlFor="pointFlag">Tracking Point Flag</Label>
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="encryption"
            checked={tracking?.info.encryption}
            disabled={!tracking?.enable || tracking?.info.value1.length === 0}
            onCheckedChange={(checked) =>
              setValue('tracking.info.encryption', !!checked)
            }
          />
          <Label htmlFor="encryption">Encryption Value1</Label>
        </div>
      </div>
      <div className="space-y-3">
        <h3>Track ID</h3>
        <Autocomplete
          name="tracking.info.id"
          value={tracking?.info.id}
          options={options}
          selectOptions={tracks.map((track) => track.defineId)}
          disabled={!tracking?.enable}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.tracking?.info?.id && (
          <span className="error-msg">{errors.tracking.info.id.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Track Name</h3>
        <Input
          value={tracking?.info.name}
          readOnly={true}
          onChange={() => {}}
        />
      </div>
      {nodeType === 'GetDigit' && (
        <div className="space-y-3">
          <h3>Display Pattern</h3>
          <Autocomplete
            name="tracking.info.pattern"
            value={tracking?.info.pattern}
            options={options}
            disabled={!tracking?.enable}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
      )}
      <div className="space-y-3">
        <h3>Track Value1</h3>
        <Autocomplete
          name="tracking.info.value1"
          value={tracking?.info.value1}
          rows={3}
          options={options}
          disabled={!tracking?.enable}
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
      <div className="space-y-3">
        <h3>Track Value2</h3>
        <Autocomplete
          name="tracking.info.value2"
          value={tracking?.info.value2}
          rows={3}
          options={options}
          disabled={!tracking?.enable}
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
    </div>
  )
}
