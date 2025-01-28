'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import { RadioGroup, RadioGroupItem } from '@/app/_components/radio-group'
import { DELIMETER_TYPE_OPTIONS } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineString } from '@/models/define'
import { StringParserInfo } from '@/models/property/flow'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NodePropertyTabProps } from '../node-property/types'

export default function ParseInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const parserInfo = getValues(props.tabName) as StringParserInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const router = useRouter()

  const [StringDesc, setStringDesc] = useState<string>()

  const { data: strings } = useSuspenseQuery({
    ...useQueryDefines<DefineString>('string'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    const string = strings.find(
      (string) => string.defineId === parserInfo?.formatId,
    )
    setStringDesc(string?.property.name || '')
  }, [parserInfo?.formatId, strings])

  const handleMoveButtonClick = () => {
    const string = strings.find(
      (string) => string.defineId === parserInfo?.formatId,
    )!
    router.push(`/defines/global/string/${string.id}`)
  }

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Name</h3>
        <Autocomplete
          name="parserInfo.name"
          value={parserInfo?.name}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.parserInfo?.name && (
          <span className="error-msg">{errors.parserInfo.name.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <RadioGroup
          value={parserInfo?.type}
          onValueChange={(value) => setValue('parserInfo.type', value)}
        >
          <div className="flex gap-3">
            <RadioGroupItem value="Parsing Size" id="r1" />
            <Label htmlFor="r1">Parsing Size</Label>
          </div>
          <div className="flex gap-3">
            <RadioGroupItem value="Parsing Delimiter" id="r1" />
            <Label htmlFor="r1">Parsing Delimiter</Label>
          </div>
        </RadioGroup>
      </div>
      {parserInfo?.type === 'Parsing Size' && (
        <div className="space-y-3">
          <h3>Format ID</h3>
          <div className="flex gap-1.5">
            <Autocomplete
              name="parserInfo.formatId"
              value={parserInfo?.formatId}
              selectOptions={strings.map((string) => string.defineId)}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <Button
              variant="secondary3"
              disabled={!parserInfo?.formatId}
              onClick={handleMoveButtonClick}
            >
              Move
            </Button>
          </div>
          <Input value={StringDesc} readOnly={true} onChange={() => {}} />
          {errors.parserInfo?.formatId && (
            <span className="error-msg">
              {errors.parserInfo.formatId.message}
            </span>
          )}
        </div>
      )}
      {parserInfo?.type === 'Parsing Delimiter' && (
        <div className="space-y-3">
          <h3>Delimiter</h3>
          <Autocomplete
            name="parserInfo.delimiter"
            value={parserInfo?.delimiter}
            options={options}
            selectOptions={DELIMETER_TYPE_OPTIONS}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.parserInfo?.delimiter && (
            <span className="error-msg">
              {errors.parserInfo.delimiter.message}
            </span>
          )}
        </div>
      )}
      <div className="space-y-3">
        <h3>Parsing Data</h3>
        <Autocomplete
          name="parserInfo.parsingData"
          value={parserInfo?.parsingData}
          rows={3}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.parserInfo?.parsingData && (
          <span className="error-msg">
            {errors.parserInfo.parsingData.message}
          </span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="parserInfo.condition"
          value={parserInfo?.condition}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.parserInfo?.condition && (
          <span className="error-msg">
            {errors.parserInfo.condition.message}
          </span>
        )}
      </div>
    </div>
  )
}
