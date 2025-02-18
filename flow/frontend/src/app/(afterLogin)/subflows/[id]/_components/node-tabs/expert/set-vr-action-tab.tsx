'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import PlayButton from '@/app/_components/play-button'
import { Separator } from '@/ui/separator'
import { SCORE_OPTIONS_100 } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineMent } from '@/models/define'
import { VrAction } from '@/models/property/flow'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function SetVRActionTab(props: NodePropertyTabProps) {
  const { getValues, setValue } = useNodePropertiesContext()
  const vrAction = getValues(props.tabName) as VrAction | undefined
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
    const ment = ments.find(
      (ment) => `'${ment.defineId}'` === vrAction?.errorInfo.timeout,
    )
    setMentDesc(ment?.property.desc || '')
  }, [ments, vrAction?.errorInfo.timeout])

  useEffect(() => {
    const ment = ments.find(
      (ment) => `'${ment.defineId}'` === vrAction?.errorInfo.inputError,
    )
    setMentDesc(ment?.property.desc || '')
  }, [ments, vrAction?.errorInfo.inputError])

  useEffect(() => {
    const ment = ments.find(
      (ment) => `'${ment.defineId}'` === vrAction?.errorInfo.retry,
    )
    setMentDesc(ment?.property.desc || '')
  }, [ments, vrAction?.errorInfo.retry])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="space-y-6 p-6">
        <h2>Recognize Action</h2>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3>Confidence Score High</h3>
            <div className="flex items-center space-x-3">
              <Autocomplete
                name="vrAction.highScore"
                value={vrAction?.highScore}
                options={options}
                selectOptions={SCORE_OPTIONS_100}
                onChange={setValue}
                onValueChange={onValueChange}
              />
              <h3>(%)</h3>
            </div>
          </div>
          <div className="space-y-3">
            <h3>Confidence Score Low</h3>
            <div className="flex items-center space-x-3">
              <Autocomplete
                name="vrAction.lowScore"
                value={vrAction?.lowScore}
                options={options}
                selectOptions={SCORE_OPTIONS_100}
                onChange={setValue}
                onValueChange={onValueChange}
              />
              <h3>(%)</h3>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="flex gap-3">
          <Checkbox
            id="clearDigit"
            checked={vrAction?.errorInfo.clearDigit}
            onCheckedChange={(checked) =>
              setValue('vrAction.errorInfo.clearDigit', !!checked)
            }
          />
          <Label htmlFor="clearDigit">Clear Digit</Label>
        </div>
        <div className="space-y-3">
          <h3>Timeout Ment</h3>
          <div className="flex gap-1.5">
            <Autocomplete
              name="vrAction.errorInfo.timeout"
              value={vrAction?.errorInfo.timeout}
              options={options}
              selectOptions={mentOptions}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <PlayButton disabled={!vrAction?.errorInfo.timeout} />
          </div>
        </div>
        <div className="space-y-3">
          <h3>Input Error Ment</h3>
          <div className="flex gap-1.5">
            <Autocomplete
              name="vrAction.errorInfo.inputError"
              value={vrAction?.errorInfo.inputError}
              options={options}
              selectOptions={mentOptions}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <PlayButton disabled={!vrAction?.errorInfo.inputError} />
          </div>
        </div>
        <div className="space-y-3">
          <h3>Retry Error Ment</h3>
          <div className="flex gap-1.5">
            <Autocomplete
              name="vrAction.errorInfo.retry"
              value={vrAction?.errorInfo.retry}
              options={options}
              selectOptions={mentOptions}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <PlayButton disabled={!vrAction?.errorInfo.retry} />
          </div>
        </div>
        <Input value={mentDesc} readOnly={true} onChange={() => {}} />
      </div>
    </div>
  )
}
