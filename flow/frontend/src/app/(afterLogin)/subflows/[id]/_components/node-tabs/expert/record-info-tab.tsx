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
import { Separator } from '@/ui/separator'
import {
  CHOICE_CALL_OPTIONS,
  END_KEY_OPTIONS,
  RECORD_MODE_OPTIONS,
  TIMEOUT_OPTIONS_10,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineMent } from '@/models/define'
import { RecordInfo } from '@/models/property/telephony'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function RecordInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as RecordInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const [mentDesc, setMentDesc] = useState<string>()

  const { data: ments } = useSuspenseQuery({
    ...useQueryDefines<DefineMent>('ment'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    const ment = ments.find((ment) => `'${ment.defineId}'` === info?.ment)
    setMentDesc(ment?.property.desc || '')
  }, [info?.ment, ments])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>File Name</h3>
          <Autocomplete
            name="info.fileName"
            value={info?.fileName}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.info?.fileName && (
            <span className="error-msg">{errors.info.fileName.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>File Path</h3>
          <Autocomplete
            name="info.filePath"
            value={info?.filePath}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="flex flex-col space-y-3">
          <div className="flex gap-3">
            <Checkbox
              id="background"
              checked={info?.background}
              disabled={info?.twoWay}
              onCheckedChange={(checked) => {
                if (checked) {
                  setValue('info.background', true)
                  setValue('info.asr', false)
                } else {
                  setValue('info.background', false)
                }
              }}
            />
            <Label htmlFor="background">Background</Label>
          </div>
          <div className="flex gap-3">
            <Checkbox
              id="asr"
              checked={info?.asr}
              onCheckedChange={(checked) => {
                if (checked) {
                  setValue('info.asr', true)
                  setValue('info.background', false)
                  setValue('info.twoWay', false)
                } else {
                  setValue('info.asr', false)
                }
              }}
            />
            <Label htmlFor="asr">Asr</Label>
          </div>
          <div className="flex gap-3">
            <Checkbox
              id="twoWay"
              checked={info?.twoWay}
              onCheckedChange={(checked) => {
                if (checked) {
                  setValue('info.twoWay', true)
                  setValue('info.background', true)
                  setValue('info.asr', false)
                } else {
                  setValue('info.twoWay', false)
                }
              }}
            />
            <Label htmlFor="twoWay">Two-way</Label>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <h3>Mode</h3>
          <Select
            value={info?.mode}
            disabled={!info?.twoWay}
            onValueChange={(value) => setValue('info.mode', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECORD_MODE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-3">
            <Checkbox
              id="beep"
              checked={info?.beep}
              disabled={info?.asr || info?.background || info?.twoWay}
              onCheckedChange={(checked) => setValue('info.beep', !!checked)}
            />
            <Label htmlFor="beep">Beep</Label>
          </div>
        </div>
        <div className="space-y-3">
          <h3>No Voice(s)</h3>
          <Autocomplete
            name="info.noVoice"
            value={info?.noVoice}
            options={options}
            selectOptions={TIMEOUT_OPTIONS_10}
            disabled={info?.background || info?.twoWay}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.info?.noVoice && (
            <span className="error-msg">{errors.info.noVoice.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Max Time(s)</h3>
          <Autocomplete
            name="info.maxTime"
            value={info?.maxTime}
            options={options}
            selectOptions={TIMEOUT_OPTIONS_10}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.info?.maxTime && (
            <span className="error-msg">{errors.info.maxTime.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Max Silence(s)</h3>
          <Autocomplete
            name="info.maxSilence"
            value={info?.maxSilence}
            options={options}
            selectOptions={TIMEOUT_OPTIONS_10}
            disabled={info?.background || info?.twoWay}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.info?.maxSilence && (
            <span className="error-msg">{errors.info.maxSilence.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Termination</h3>
          <Autocomplete
            name="info.termKey"
            value={info?.termKey}
            options={options}
            selectOptions={END_KEY_OPTIONS.slice(1)}
            disabled={info?.background || info?.twoWay}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.info?.termKey && (
            <span className="error-msg">{errors.info.termKey.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Choice Call</h3>
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
          <h3>Ment File</h3>
          <div className="flex gap-1.5">
            <Autocomplete
              name="info.ment"
              value={info?.ment}
              options={options}
              selectOptions={ments.map((ment) => ({
                label: `'${ment.defineId}' - "${ment.property.desc}"`,
                value: `'${ment.defineId}'`,
              }))}
              disabled={!info?.asr}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <PlayButton disabled={!info?.ment} />
          </div>
          <Input value={mentDesc} readOnly={true} onChange={() => {}} />
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
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
    </div>
  )
}
