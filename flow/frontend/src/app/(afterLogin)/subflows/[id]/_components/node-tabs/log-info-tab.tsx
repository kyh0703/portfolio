'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import Label from '@/app/_components/label'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineLog } from '@/models/define'
import { LogWriteInfo } from '@/models/property/log'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { NodePropertyTabProps } from '../node-property/types'
import { Input } from '@/app/_components/input'

export default function LogInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as LogWriteInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const { data: logs } = useSuspenseQuery({
    ...useQueryDefines<DefineLog>('log'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    const log = logs.find((log) => log.defineId === info?.id)
    setValue('info.path', log?.property?.path || '')
  }, [info?.id, logs, setValue])

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="flex gap-3">
        <Checkbox
          id="isSleeLog"
          checked={info?.isSleeLog}
          onCheckedChange={(checked) => setValue('info.isSleeLog', !!checked)}
        />
        <Label htmlFor="isSleeLog">In SLEE Log</Label>
      </div>
      <div className="space-y-3">
        <h3>Log ID</h3>
        <Autocomplete
          name="info.id"
          value={info?.id}
          options={options}
          selectOptions={logs.map((log) => log.defineId)}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.id && (
          <span className="error-msg">{errors.info.id.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Log Path</h3>
        <Input value={info?.path} readOnly={true} onChange={() => {}} />
      </div>
      <div className="flex gap-3">
        <Checkbox
          id="formatEx"
          checked={info?.formatEx}
          onCheckedChange={(checked) => setValue('info.formatEx', !!checked)}
        />
        <Label htmlFor="formatEx">Format Ex</Label>
      </div>
      <div className="space-y-3">
        <h3>Expression</h3>
        <Autocomplete
          name="info.expression"
          value={info?.expression}
          rows={3}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.expression && (
          <span className="error-msg">{errors.info.expression.message}</span>
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
