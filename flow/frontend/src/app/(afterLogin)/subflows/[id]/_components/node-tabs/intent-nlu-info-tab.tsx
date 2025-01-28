'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
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
  THRESHOLD_OPTIONS,
  TIMEOUT_OPTIONS_30,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineIntent } from '@/models/define'
import { EntityCallInfo } from '@/models/property/ai'
import { useQueryDefines } from '@/services/define'
import { Separator } from '@/ui/separator'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { NodePropertyTabProps } from '../node-property/types'

export default function IntentNluInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const entityInfo = getValues(props.tabName) as EntityCallInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const router = useRouter()

  const { data: intents } = useSuspenseQuery({
    ...useQueryDefines<DefineIntent>('intent'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    const intent = intents.find(
      (intent) => intent.defineId === entityInfo?.intentId,
    )

    setValue('entityInfo.intentName', intent?.property.name || '')
  }, [entityInfo?.intentId, intents, setValue])

  const handleMoveButtonClick = () => {
    const intent = intents.find(
      (intent) => intent.defineId === entityInfo?.intentId,
    )
    if (intent) {
      router.push('/defines/global/intent/' + intent.id)
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>Name</h3>
          <Autocomplete
            name="entityInfo.name"
            value={entityInfo?.name}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.entityInfo?.name && (
            <span className="error-msg">{errors.entityInfo.name.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Intent ID</h3>
          <div className="flex items-center space-x-3">
            <Select
              value={entityInfo?.intentId}
              onValueChange={(value) => setValue('entityInfo.intentId', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {intents.map(({ defineId }) => (
                  <SelectItem key={defineId} value={defineId}>
                    {defineId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="secondary3"
              disabled={!entityInfo?.intentId}
              onClick={handleMoveButtonClick}
            >
              Move
            </Button>
          </div>
          {errors.entityInfo?.intentId && (
            <span className="error-msg">
              {errors.entityInfo.intentId.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Intent Name</h3>
          <Input
            value={entityInfo?.intentName}
            readOnly={true}
            onChange={() => {}}
          />
        </div>
        <div className="space-y-3">
          <h3>End Method</h3>
          <Select
            value={entityInfo?.endMethod}
            onValueChange={(value) => setValue('entityInfo.endMethod', value)}
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
            id="ignoreGlobalIntent"
            checked={entityInfo?.ignoreGlobalIntent}
            onCheckedChange={(checked) =>
              setValue('entityInfo.ignoreGlobalIntent', !!checked)
            }
          />
          <Label htmlFor="ignoreGlobalIntent">Ignore Global Intent</Label>
        </div>
        <div className="space-y-3">
          <h3>Condition</h3>
          <Autocomplete
            name="entityInfo.condition"
            value={entityInfo?.condition}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.entityInfo?.condition && (
            <span className="error-msg">
              {errors.entityInfo.condition.message}
            </span>
          )}
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <h2>NLU Info</h2>
        <div className="space-y-3">
          <h3>Transaction ID</h3>
          <Autocomplete
            name="entityInfo.nluInfo.transId"
            value={entityInfo?.nluInfo.transId}
            options={options}
            selectOptions={
              // TODO: 운영관리에(SWAT 등) 등록된 NLU Adaptor 목록
              []
            }
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.entityInfo?.nluInfo?.transId && (
            <span className="error-msg">
              {errors.entityInfo.nluInfo.transId.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Timeout</h3>
          <Autocomplete
            name="entityInfo.nluInfo.timeout"
            value={entityInfo?.nluInfo.timeout}
            options={options}
            selectOptions={TIMEOUT_OPTIONS_30}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>Model Name</h3>
          <Autocomplete
            name="entityInfo.nluInfo.modelName"
            value={entityInfo?.nluInfo.modelName}
            options={options}
            selectOptions={
              // TODO: 운영관리에(SWAT 등) 등록된 NLU Model Name 목록
              []
            }
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.entityInfo?.nluInfo?.modelName && (
            <span className="error-msg">
              {errors.entityInfo.nluInfo.modelName.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Threshold</h3>
          <Autocomplete
            name="entityInfo.nluInfo.threshold"
            value={entityInfo?.nluInfo.threshold}
            options={options}
            selectOptions={THRESHOLD_OPTIONS}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
      </div>
    </div>
  )
}
