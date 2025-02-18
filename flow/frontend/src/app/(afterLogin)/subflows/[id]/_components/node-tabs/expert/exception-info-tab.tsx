'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Input } from '@/app/_components/input'
import PlayButton from '@/app/_components/play-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import {
  APPLICATION_DOWN_METHOD_OPTIONS,
  DNIS_OPTIONS,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineMent } from '@/models/define'
import { ExceptionInfo } from '@/models/property/iweb'
import { useQueryDefines } from '@/services/define'
import { Separator } from '@/ui/separator'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function ExceptionInfoTab(props: NodePropertyTabProps) {
  const { getValues, setValue } = useNodePropertiesContext()
  const exceptionInfo = getValues(props.tabName) as ExceptionInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const [mentDesc, setMentDesc] = useState<string>()

  const { data: ments } = useSuspenseQuery({
    ...useQueryDefines<DefineMent>('ment'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    const ment = ments.find(
      (ment) => `'${ment.defineId}'` === exceptionInfo?.guideMent,
    )
    setMentDesc(ment?.property.desc || '')
  }, [exceptionInfo?.guideMent, ments])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>Application Down Method</h3>
          <Select
            value={exceptionInfo?.downMethod}
            onValueChange={(value) =>
              setValue('exceptionInfo.downMethod', value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {APPLICATION_DOWN_METHOD_OPTIONS.map((option) => (
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
        <h2>Change Service</h2>
        <div className="space-y-3">
          <h3>Service</h3>
          <Autocomplete
            name="exceptionInfo.changeService.service"
            value={exceptionInfo?.changeService.service}
            options={options}
            selectOptions={
              // TODO: 운영관리와 연동된 데이터가 있다면 등록된 CTI Adaptor 리스트
              []
            }
            disabled={exceptionInfo?.downMethod !== 'change service'}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>ANI</h3>
          <Autocomplete
            name="exceptionInfo.changeService.ani"
            value={exceptionInfo?.changeService.ani}
            options={options}
            disabled={exceptionInfo?.downMethod !== 'change service'}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>DNIS</h3>
          <Autocomplete
            name="exceptionInfo.changeService.dnis"
            value={exceptionInfo?.changeService.dnis}
            options={options}
            selectOptions={DNIS_OPTIONS}
            disabled={exceptionInfo?.downMethod !== 'change service'}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>User Data</h3>
          <Autocomplete
            name="exceptionInfo.changeService.usrData"
            value={exceptionInfo?.changeService.usrData}
            options={options}
            disabled={exceptionInfo?.downMethod !== 'change service'}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>Guide Ment</h3>
          <div className="flex gap-1.5">
            <Autocomplete
              name="exceptionInfo.guideMent"
              value={exceptionInfo?.guideMent}
              options={options}
              selectOptions={ments.map((ment) => ({
                label: `${ment.defineId} - ${ment.property.desc}`,
                value: `'${ment.defineId}'`,
              }))}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <PlayButton
              disabled={!exceptionInfo?.guideMent}
              onChange={() => {}}
            />
          </div>
          <Input value={mentDesc} readOnly={true} onChange={() => {}} />
        </div>
      </div>
    </div>
  )
}
