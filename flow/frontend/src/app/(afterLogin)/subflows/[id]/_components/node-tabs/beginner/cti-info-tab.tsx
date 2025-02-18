'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import PlayButton from '@/app/_components/play-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import {
  AGENT_TYPE_OPTIONS,
  CHOICE_CALL_OPTIONS,
  TIMEOUT_OPTIONS_30,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineMent } from '@/models/define'
import type { CtiCallInfo } from '@/models/property/telephony'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function BeginnerCTIInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as CtiCallInfo | undefined
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
        <h3>Name</h3>
        <Autocomplete
          name="info.name"
          value={info?.name}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.name && (
          <span className="error-msg">{errors.info.name.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Command</h3>
        <Autocomplete
          name="info.command"
          value={info?.command}
          options={options}
          selectOptions={
            []
            // TODO: CTI Command 리스트를 리스팅
          }
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.command && (
          <span className="error-msg">{errors.info.command.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Service</h3>
        <Autocomplete
          name="info.service"
          value={info?.service}
          options={options}
          selectOptions={
            []
            // TODO: 운영관리와 연동된 데이터가 있다면 등록된 CTI Adaptor 리스트를 리스팅
          }
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.service && (
          <span className="error-msg">{errors.info.service.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Choice Call, for BGM</h3>
        <Autocomplete
          name="info.choiceCall"
          value={info?.choiceCall}
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
      <div className="flex flex-col space-y-3">
        <h3>Timeout</h3>
        <Autocomplete
          name="info.timeout"
          value={info?.timeout}
          options={options}
          selectOptions={TIMEOUT_OPTIONS_30}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.timeout && (
          <span className="error-msg">{errors.info.timeout.message}</span>
        )}
        <div className="flex gap-3">
          <Checkbox
            id="switch"
            checked={info?.switch}
            onCheckedChange={(checked) => setValue('info.switch', !!checked)}
          />
          <Label htmlFor="switch">Switch between call center</Label>
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="agent"
            checked={info?.agent}
            onCheckedChange={(checked) => setValue('info.agent', !!checked)}
          />
          <Label htmlFor="agent">Agent Call</Label>
        </div>
      </div>
      <div className="space-y-3">
        <h3>Agent Type</h3>
        <Select
          value={info?.agentType}
          disabled={!info?.agent}
          onValueChange={(value) => setValue('info.agentType', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AGENT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="info.condition"
          value={info?.condition}
          options={options}
          selectOptions={
            []
            // TODO: CTI Command 리스트를 리스팅
          }
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
