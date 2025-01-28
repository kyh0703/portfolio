'use client'

import { PushPinIcon } from '@/app/_components/icon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { LOG_SAFE_MODE_OPTIONS, type LogSafeMode } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import { useNodes } from '@/hooks/xyflow'
import type { General } from '@/models/property/common'
import { Toggle } from '@/ui/toggle'
import { useEffect } from 'react'
import { NodePropertyTabProps } from '../node-property/types'
import Autocomplete from '@/app/_components/autocomplete'
import useAutocomplete from '@/hooks/use-autocomplete'

export default function GeneralTab(props: NodePropertyTabProps) {
  const { nodeId, tabName } = props
  const { getValues, setValue } = useNodePropertiesContext()
  const general = getValues(tabName) as General
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const { setDescription } = useNodes()

  useEffect(() => {
    if (general?.lockLabel) {
      return
    }
    setDescription(nodeId, general?.label!)
  }, [general?.label, general?.lockLabel, nodeId, setDescription])

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Log Safe Mode</h3>
        <Select
          value={general?.logSafeMode}
          onValueChange={(value) =>
            setValue('general.logSafeMode', value as LogSafeMode)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LOG_SAFE_MODE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3>Label</h3>
          <Toggle
            pressed={general?.lockLabel}
            onPressedChange={(pressed) =>
              setValue('general.lockLabel', pressed)
            }
          >
            <PushPinIcon />
          </Toggle>
        </div>
        <div className="">
          <Autocomplete
            name="general.label"
            value={general?.label}
            rows={10}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
      </div>
    </div>
  )
}
