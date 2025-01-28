'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
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
  END_METHOD_OPTIONS,
  RETRY_OPTIONS,
  THRESHOLD_OPTIONS,
  TIMEOUT_OPTIONS_30,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineIntent } from '@/models/define'
import { NLURequestInfo } from '@/models/property/ai'
import { useQueryDefines } from '@/services/define'
import { Separator } from '@/ui/separator'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { NodePropertyTabProps } from '../node-property/types'

export default function NLUInfoTab(props: NodePropertyTabProps) {
  const { tabName } = props
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const nluInfo = getValues(tabName) as NLURequestInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const { data: intents } = useSuspenseQuery({
    ...useQueryDefines<DefineIntent>('intent'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    const intent = intents.find(
      (intent) => intent.defineId === nluInfo?.intentId,
    )
    setValue('nluInfo.intentName', intent?.property?.name || '')
  }, [intents, nluInfo?.intentId, setValue])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>Name</h3>
          <Autocomplete
            name="nluInfo.name"
            value={nluInfo?.name}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.nluInfo?.name && (
            <span className="error-msg">{errors.nluInfo.name.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Transaction ID</h3>
          <Autocomplete
            name="nluInfo.transId"
            value={nluInfo?.transId}
            options={options}
            selectOptions={
              // TODO: 운영관리에(SWAT 등) 등록된 ICM Adaptor 목록
              []
            }
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.nluInfo?.transId && (
            <span className="error-msg">{errors.nluInfo.transId.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Model Name</h3>
          <Autocomplete
            name="nluInfo.modelName"
            value={nluInfo?.modelName}
            options={options}
            selectOptions={
              // TODO: 운영관리에(SWAT 등) 등록된 NLU Model Name 목록
              []
            }
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.nluInfo?.modelName && (
            <span className="error-msg">
              {errors.nluInfo.modelName.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Threshold</h3>
          <Autocomplete
            name="nluInfo.threshold"
            value={nluInfo?.threshold}
            options={options}
            selectOptions={THRESHOLD_OPTIONS}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.nluInfo?.threshold && (
            <span className="error-msg">
              {errors.nluInfo.threshold.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Retry</h3>
          <Autocomplete
            name="nluInfo.retry"
            value={nluInfo?.retry}
            options={options}
            selectOptions={RETRY_OPTIONS}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.nluInfo?.retry && (
            <span className="error-msg">{errors.nluInfo.retry.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Timeout</h3>
          <Autocomplete
            name="nluInfo.timeout"
            value={nluInfo?.timeout}
            options={options}
            selectOptions={TIMEOUT_OPTIONS_30}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.nluInfo?.timeout && (
            <span className="error-msg">{errors.nluInfo.timeout.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>End Method</h3>
          <Select
            value={nluInfo?.endMethod}
            onValueChange={(value) => setValue('nluInfo.endMethod', value)}
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
          {errors.nluInfo?.endMethod && (
            <span className="error-msg">
              {errors.nluInfo.endMethod.message}
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-3">
          <div className="flex gap-3">
            <Checkbox
              id="tracking"
              checked={nluInfo?.tracking}
              onCheckedChange={(checked) =>
                setValue('nluInfo.tracking', !!checked)
              }
            />
            <Label htmlFor="tracking">Tracking</Label>
          </div>
          <div className="flex gap-3">
            <Checkbox
              id="setIntent"
              checked={nluInfo?.setIntent}
              onCheckedChange={(checked) =>
                setValue('nluInfo.setIntent', !!checked)
              }
            />
            <Label htmlFor="setIntent">Set Intent Value</Label>
          </div>
        </div>
        <div className="space-y-3">
          <h3>Intent ID</h3>
          <Autocomplete
            name="nluInfo.intentId"
            value={nluInfo?.intentId}
            options={options}
            selectOptions={intents.map((intent) => `'${intent.defineId}'`)}
            disabled={!nluInfo?.setIntent}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.nluInfo?.intentId && (
            <span className="error-msg">{errors.nluInfo.intentId.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Intent Name</h3>
          <Input
            value={nluInfo?.intentName}
            readOnly={true}
            onChange={() => {}}
          />
        </div>
        <div className="space-y-3">
          <h3>Condition</h3>
          <Autocomplete
            name="nluInfo.condition"
            value={nluInfo?.condition}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.nluInfo?.condition && (
            <span className="error-msg">
              {errors.nluInfo.condition.message}
            </span>
          )}
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <div className="flex gap-3">
            <Checkbox
              id="setIntentValue"
              checked={nluInfo?.setIntentValue}
              onCheckedChange={(checked) =>
                setValue('nluInfo.setIntentValue', !!checked)
              }
            />
            <Label htmlFor="setIntentValue">Set NLU Text</Label>
          </div>
          {nluInfo?.setIntentValue && (
            <Autocomplete
              name="nluInfo.intentValue"
              value={nluInfo?.intentValue}
              rows={3}
              placeholder="Write your thoughts here..."
              options={options}
              onChange={setValue}
              onValueChange={onValueChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}
