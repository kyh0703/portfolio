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
  SELECT_CONDITION_OPTIONS,
  SET_MENT_OPTIONS,
  TIMEOUT_OPTIONS_10,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineMent } from '@/models/define'
import { MCMentInfo } from '@/models/property/flow'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { NodePropertyTabProps } from '../node-property/types'

export default function SetMentInfoTab(props: NodePropertyTabProps) {
  const { getValues, setValue } = useNodePropertiesContext()
  const mentInfo = getValues(props.tabName) as MCMentInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const [mentDesc, setMentDesc] = useState<string>()
  const [errorMentDesc, setErrorMentDesc] = useState<string>()

  const { data: ments } = useSuspenseQuery({
    ...useQueryDefines<DefineMent>('ment'),
    select: (data) => removeDuplicateDefines(data),
  })

  const mentOptions = useMemo(
    () =>
      ments.map((ment) => ({
        label: `'${ment.defineId}' - "${ment.property.desc}"`,
        value: `'${ment.defineId}'`,
      })),
    [ments],
  )

  useEffect(() => {
    const ment = ments.find(
      (ment) => `'${ment.defineId}'` === mentInfo?.ment.choiceMent,
    )
    setMentDesc(ment?.property.desc || '')
  }, [mentInfo?.ment.choiceMent, ments])

  useEffect(() => {
    const ment = ments.find(
      (ment) => `'${ment.defineId}'` === mentInfo?.errorInfo.timeout,
    )
    setErrorMentDesc(ment?.property.desc || '')
  }, [mentInfo?.errorInfo.timeout, ments])

  useEffect(() => {
    const ment = ments.find(
      (ment) => `'${ment.defineId}'` === mentInfo?.errorInfo.inputError,
    )
    setErrorMentDesc(ment?.property.desc || '')
  }, [mentInfo?.errorInfo.inputError, ments])

  useEffect(() => {
    const ment = ments.find(
      (ment) => `'${ment.defineId}'` === mentInfo?.errorInfo.retry,
    )
    setErrorMentDesc(ment?.property.desc || '')
  }, [mentInfo?.errorInfo.retry, ments])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="space-y-6 p-6">
        <h2>Ment</h2>
        <div className="flex gap-3">
          <Checkbox
            id="mentDigit"
            checked={mentInfo?.ment.clearDigit}
            onCheckedChange={(checked) =>
              setValue('mentInfo.ment.clearDigit', !!checked)
            }
          />
          <Label htmlFor="mentDigit">Clear Digit</Label>
        </div>
        <div className="space-y-3">
          <h3>Choice Ment</h3>
          <div className="flex items-center justify-between gap-3">
            <Autocomplete
              name="mentInfo.ment.choiceMent"
              value={mentInfo?.ment.choiceMent}
              options={options}
              selectOptions={mentOptions}
              onChange={setValue}
              onValueChange={onValueChange}
            />
          </div>
          <Input value={mentDesc} readOnly={true} onChange={() => {}} />
        </div>
        <div className="space-y-3">
          <h3>Ment Type</h3>
          <Select
            value={mentInfo?.ment.mentType}
            onValueChange={(v) => setValue('mentInfo.ment.mentType', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SET_MENT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <h3>Speaker ID</h3>
          <Autocomplete
            name="mentInfo.ment.ttsInfo.speakerID"
            value={mentInfo?.ment.ttsInfo.speakerID}
            options={options}
            disabled={
              !(
                mentInfo?.ment.mentType === 'TTS-Stream' ||
                mentInfo?.ment.mentType === ' TTS-File'
              )
            }
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>TTS Name</h3>
          <Autocomplete
            name="mentInfo.ment.ttsInfo.name"
            value={mentInfo?.ment.ttsInfo.name}
            options={options}
            selectOptions={
              // TODO: 운영관리에(SWAT 등) 등록된 TTS 서버 목록
              []
            }
            disabled={
              !(
                mentInfo?.ment.mentType === 'TTS-Stream' ||
                mentInfo?.ment.mentType === ' TTS-File'
              )
            }
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>Timeout</h3>
          <Autocomplete
            name="mentInfo.ment.timeout"
            value={mentInfo?.ment.timeout}
            options={options}
            selectOptions={TIMEOUT_OPTIONS_10}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>Retry</h3>
          <Autocomplete
            name="mentInfo.ment.retry"
            value={mentInfo?.ment.retry}
            options={options}
            selectOptions={TIMEOUT_OPTIONS_10}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>Play Index</h3>
          <Select
            value={mentInfo?.ment.playIndex}
            onValueChange={(value) =>
              setValue('mentInfo.ment.playIndex', value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEOUT_OPTIONS_10.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <h3>Retry DTMF</h3>
          <Select
            value={mentInfo?.ment.retryDtmf}
            onValueChange={(value) =>
              setValue('mentInfo.ment.retryDtmf', value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SELECT_CONDITION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="flex gap-3">
          <Checkbox
            id="clearDigit"
            checked={mentInfo?.errorInfo.clearDigit}
            onCheckedChange={(checked) =>
              setValue('mentInfo.errorInfo.clearDigit', !!checked)
            }
          />
          <Label htmlFor="clearDigit">Clear Digit</Label>
        </div>
        <div className="space-y-3">
          <h3>Timeout Ment</h3>
          <div className="flex gap-1.5">
            <Autocomplete
              name="mentInfo.errorInfo.timeout"
              value={mentInfo?.errorInfo.timeout}
              options={options}
              selectOptions={mentOptions}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <PlayButton disabled={!mentInfo?.ment.timeout} />
          </div>
        </div>
        <div className="space-y-3">
          <h3>Input Error Ment</h3>
          <div className="flex gap-1.5">
            <Autocomplete
              name="mentInfo.errorInfo.inputError"
              value={mentInfo?.errorInfo.inputError}
              options={options}
              selectOptions={mentOptions}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <PlayButton disabled={!mentInfo?.errorInfo.inputError} />
          </div>
        </div>
        <div className="space-y-3">
          <h3>Retry Error Ment</h3>
          <div className="flex gap-1.5">
            <Autocomplete
              name="mentInfo.errorInfo.retry"
              value={mentInfo?.errorInfo.retry}
              options={options}
              selectOptions={mentOptions}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <PlayButton disabled={!mentInfo?.errorInfo.retry} />
          </div>
        </div>
        <Input value={errorMentDesc} readOnly={true} onChange={() => {}} />
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>Condition</h3>
          <Autocomplete
            name="mentInfo.condition"
            value={mentInfo?.condition}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
      </div>
    </div>
  )
}
