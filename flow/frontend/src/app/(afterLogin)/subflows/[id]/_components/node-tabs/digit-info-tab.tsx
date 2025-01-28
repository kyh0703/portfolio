'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import { Checkbox } from '@/app/_components/checkbox'
import { PlayOnIcon } from '@/app/_components/icon'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import {
  CHOICE_CALL_OPTIONS,
  END_KEY_OPTIONS,
  END_METHOD_OPTIONS,
  SAFE_TONE_OPTIONS,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineMent } from '@/models/define'
import type { DigitInfo, VisualARSInfo } from '@/models/property/common'
import { useQueryDefines } from '@/services/define'
import { Separator } from '@/ui/separator'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { NodePropertyTabProps } from '../node-property/types'

export default function DigitInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const digit = getValues('digit') as DigitInfo | undefined
  const vars = getValues('vars') as VisualARSInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const [mentDesc, setMentDesc] = useState<string>()

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
    const ment = ments?.find(
      (ment) => `'${ment.defineId}'` === digit?.errorInfo.timeout.ment,
    )
    setMentDesc(ment?.property.desc || '')
  }, [digit?.errorInfo.timeout.ment, ments])

  useEffect(() => {
    const ment = ments?.find(
      (ment) => `'${ment.defineId}'` === digit?.errorInfo.inputError.ment,
    )
    setMentDesc(ment?.property.desc || '')
  }, [digit?.errorInfo.inputError.ment, ments])

  useEffect(() => {
    const ment = ments?.find(
      (ment) => `'${ment.defineId}'` === digit?.errorInfo.retry.ment,
    )
    setMentDesc(ment?.property.desc || '')
  }, [digit?.errorInfo.retry.ment, ments])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>Name</h3>
          <Autocomplete
            name="digit.name"
            value={digit?.name}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>Length</h3>
          <Autocomplete
            name="digit.length"
            value={digit?.length}
            options={options}
            disabled={vars?.enable}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>Retry</h3>
          <Autocomplete
            name="digit.retry"
            value={digit?.retry}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>DTMF Mask</h3>
          <Autocomplete
            name="digit.dtmfMask"
            value={digit?.dtmfMask}
            options={options}
            disabled={vars?.enable}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>Timeout</h3>
          <Autocomplete
            name="digit.timeout"
            value={digit?.timeout}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.digit?.timeout && (
            <span className="error-msg">{errors.digit.timeout.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Inter Timeout</h3>
          <Autocomplete
            name="digit.interTimeout"
            value={digit?.interTimeout}
            options={options}
            disabled={vars?.enable}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.digit?.interTimeout && (
            <span className="error-msg">
              {errors.digit.interTimeout.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>SafeTone</h3>
          <Select
            value={digit?.safeTone}
            disabled={vars?.enable}
            onValueChange={(value) => setValue('digit.safeTone', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SAFE_TONE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <h3>Choice Call</h3>
          <Autocomplete
            name="digit.choiceCall"
            value={digit?.choiceCall}
            options={options}
            selectOptions={CHOICE_CALL_OPTIONS}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>End Key</h3>
          <Select
            value={digit?.endKey}
            onValueChange={(value) => setValue('digit.endKey', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {END_KEY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <h3>Error Key</h3>
          <Select
            value={digit?.errorKey}
            disabled={!digit?.endKey}
            onValueChange={(value) => setValue('digit.errorKey', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {END_KEY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <h3>End Method</h3>
          <Select
            value={digit?.endMethod}
            onValueChange={(value) => setValue('digit.endMethod', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {END_METHOD_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="abandon"
            checked={digit?.abandon}
            onCheckedChange={(checked) => setValue('digit.abandon', !!checked)}
          />
          <Label htmlFor="abandon">Check Abandon</Label>
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="flex gap-3">
          <Checkbox
            id="errorInfo.clearDigit"
            checked={digit?.errorInfo.clearDigit}
            onCheckedChange={(checked) =>
              setValue('digit.errorInfo.clearDigit', !!checked)
            }
          />
          <Label htmlFor="clearDigit">Clear Digit Error Ment</Label>
        </div>
        <div className="space-y-3">
          <h3>Timeout</h3>
          <div className="flex items-center gap-1">
            <Autocomplete
              name="digit.errorInfo.timeout.ment"
              value={digit?.errorInfo.timeout.ment}
              options={options}
              selectOptions={mentOptions}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <Button variant="ghost" size="icon" aria-label="playon">
              <PlayOnIcon width={11} height={14} />
            </Button>
            <div className="flex gap-3">
              <Checkbox
                id="timeout.tracking"
                checked={digit?.errorInfo.timeout.tracking}
                onCheckedChange={(checked) =>
                  setValue('digit.errorInfo.timeout.tracking', !!checked)
                }
              />
              <Label htmlFor="timeout.tracking">Tracking</Label>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h3>Input</h3>
          <div className="flex items-center gap-1">
            <Autocomplete
              name="digit.errorInfo.inputError.ment"
              value={digit?.errorInfo.inputError.ment}
              options={options}
              selectOptions={mentOptions}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <Button variant="ghost" size="icon" aria-label="playon">
              <PlayOnIcon width={11} height={14} />
            </Button>
            <div className="flex gap-3">
              <Checkbox
                id="inputError.tracking"
                checked={digit?.errorInfo.inputError.tracking}
                onCheckedChange={(checked) =>
                  setValue('digit.errorInfo.inputError.tracking', !!checked)
                }
              />
              <Label htmlFor="inputError.tracking">Tracking</Label>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h3>Retry</h3>
          <div className="flex items-center gap-1">
            <Autocomplete
              name="digit.errorInfo.retry.ment"
              value={digit?.errorInfo?.retry?.ment}
              options={options}
              selectOptions={mentOptions}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <Button variant="ghost" size="icon" aria-label="playon">
              <PlayOnIcon width={11} height={14} />
            </Button>
            <div className="flex gap-3">
              <Checkbox
                id="retry.tracking"
                checked={digit?.errorInfo.retry.tracking}
                onCheckedChange={(checked) =>
                  setValue('digit.errorInfo.retry.tracking', !!checked)
                }
              />
              <Label htmlFor="retry.tracking">Tracking</Label>
            </div>
          </div>
        </div>
        <Input value={mentDesc} readOnly={true} onChange={() => {}} />
      </div>
      <Separator />
      <div className="space-y-3 p-6">
        <h3>Condition</h3>
        <Autocomplete
          name="digit.condition"
          value={digit?.condition}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.digit?.condition && (
          <span className="error-msg">{errors.digit.condition.message}</span>
        )}
      </div>
    </div>
  )
}
