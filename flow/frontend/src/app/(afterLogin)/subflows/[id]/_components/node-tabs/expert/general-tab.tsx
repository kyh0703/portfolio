'use client'

import Autocomplete from '@/app/_components/autocomplete'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { REQUEST_DELAY_TIME } from '@/constants/delay'
import { LOG_SAFE_MODE_OPTIONS, type LogSafeMode } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { useNodes } from '@/hooks/xyflow'
import type { General } from '@/models/property/common'
import { useUpdateNode } from '@/services/subflow'
import { Toggle } from '@/ui/toggle'
import { AppNode, useReactFlow, type AppEdge } from '@xyflow/react'
import debounce from 'lodash-es/debounce'
import { PinIcon, PinOffIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function GeneralTab(props: NodePropertyTabProps) {
  const { nodeId, tabName } = props
  const { getValues, setValue } = useNodePropertiesContext()
  const general = getValues(tabName) as General
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const { getNode } = useReactFlow<AppNode, AppEdge>()
  const node = getNode(nodeId)!
  const { setDescription } = useNodes()
  const [label, setLabel] = useState(node.data.desc)
  const updateNodeMutation = useUpdateNode()

  const fetchDesc = debounce((desc) => {
    updateNodeMutation.mutate(
      {
        nodeId: node.data.databaseId!,
        node: {
          ...node,
          data: { ...node.data, desc },
        },
      },
      { onError: () => updateNodeMutation.reset() },
    )
  }, REQUEST_DELAY_TIME)

  const handleChange = useCallback(
    (name: string, value: string) => {
      setLabel(value)
      setDescription(nodeId, value)
      setValue(name, value)
      fetchDesc(value)
    },
    [fetchDesc, nodeId, setDescription, setValue],
  )

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
            {general?.lockLabel ? (
              <PinIcon size={20} />
            ) : (
              <PinOffIcon size={20} />
            )}
          </Toggle>
        </div>
        <div className="">
          <Autocomplete
            name="general.label"
            value={label}
            rows={10}
            options={options}
            onChange={handleChange}
            onValueChange={onValueChange}
          />
        </div>
      </div>
    </div>
  )
}
