'use client'

import { Button } from '@/app/_components/button'
import { Checkbox } from '@/app/_components/checkbox'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormCheckbox from '@/app/_components/form-checkbox'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import PlayButton from '@/app/_components/play-button'
import {
  SELECT_CONDITION_OPTIONS,
  TIMEOUT_OPTIONS_0_10,
  TIMEOUT_OPTIONS_10,
} from '@/constants/options'
import type { DefineMent, DefineMenu, MenuCheckOption } from '@/models/define'
import type { MenuFilterOption } from '@/models/manage'
import type { SubFlowList } from '@/models/subflow-list'
import { useAddSubFlow } from '@/services/flow'
import { useQueryOption } from '@/services/option/queries'
import type { DefineList } from '@/types/define'
import { Separator } from '@/ui/separator'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'

function renderLabel(index: number, menuFilter: MenuFilterOption) {
  const key = `filter${index}` as keyof MenuFilterOption
  return menuFilter[key] || `Filter${index}`
}

type MenuOptionTabProps = {
  mentInfos: DefineList<DefineMent>[]
  subFlowList: SubFlowList[]
  checkOption: MenuCheckOption
}

export default function MenuOptionTab({
  mentInfos,
  subFlowList,
  checkOption,
}: MenuOptionTabProps) {
  const router = useRouter()
  const [mentDesc, setMentDesc] = useState('')

  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<DefineMenu>()

  const [
    watchTermFlow,
    watchTimeoutMent,
    watchInputMent,
    watchRetryMent,
    watchTracking,
    watchTimeoutTracking,
    watchInputTracking,
    watchRetryTracking,
  ] = useWatch({
    control,
    name: [
      'menuOpt.termFlowId',
      'menuOpt.errorInfo.timeout.ment',
      'menuOpt.errorInfo.input.ment',
      'menuOpt.errorInfo.retry.ment',
      'menuOpt.errorInfo.tracking',
      'menuOpt.errorInfo.timeout.tracking',
      'menuOpt.errorInfo.input.tracking',
      'menuOpt.errorInfo.retry.tracking',
    ],
  })

  const { mutate: addSubFlowMutate } = useAddSubFlow()
  const { data } = useSuspenseQuery(useQueryOption())

  const subFlowOptions = useMemo(
    () => subFlowList.map((subFlow) => subFlow.name),
    [subFlowList],
  )

  const mentOptions = useMemo(
    () =>
      mentInfos.map((ment) => ({
        label: `'${ment.defineId}' - "${ment.property.desc}"`,
        value: `'${ment.defineId}'`,
      })),
    [mentInfos],
  )

  const menuFilter =
    useWatch({ control, name: 'menuOpt.menuFilter' }) ?? '0,0,0,0,0,0,0,0,0,0'
  const menuFilterArray = menuFilter.split(',')

  const handleOpen = () => {
    if (!subFlowOptions.find((subFlow) => subFlow === watchTermFlow)) {
      toast.warn('SubFlow를 찾을 수 없습니다.')
      return
    }

    const subFlowId = subFlowList.find(
      (subFlow) => subFlow.name === watchTermFlow,
    )!.id

    router.push(`/subflows/${subFlowId}`)
  }

  const handleCreate = () => {
    if (!watchTermFlow) {
      toast.warn('SubFlow 이름을 입력해주세요.')
      return
    }

    if (!subFlowOptions.find((subFlow) => subFlow === watchTermFlow)) {
      addSubFlowMutate(
        {
          name: watchTermFlow!,
          version: '1.0.0',
          desc: '',
          args: { in: { param: [] }, out: { arg: [] } },
          updateDate: new Date(),
        },
        {
          onSuccess: (response) => {
            router.push(`/subflows/${response.flowId}`)
          },
        },
      )
    } else {
      const subFlowId = subFlowList.find(
        (subFlow) => subFlow.name === watchTermFlow,
      )!.id
      router.push(`/subflows/${subFlowId}`)
    }
  }

  const handleCheckboxChange = (index: number, checked: boolean) => {
    menuFilterArray[index] = checked ? '1' : '0'
    setValue('menuOpt.menuFilter', menuFilterArray.join(','))
  }

  useEffect(() => {
    if (!menuFilter) {
      setValue('menuOpt.menuFilter', '0,0,0,0,0,0,0,0,0,0')
    }
  }, [menuFilter, setValue])

  useEffect(() => {
    const ment = mentInfos.find(
      (ment) => `'${ment.defineId}'` === watchTimeoutMent,
    )
    setMentDesc(ment?.property.desc ?? '')
  }, [mentInfos, watchTimeoutMent])

  useEffect(() => {
    const ment = mentInfos.find(
      (ment) => `'${ment.defineId}'` === watchInputMent,
    )
    setMentDesc(ment?.property.desc ?? '')
  }, [mentInfos, watchInputMent])

  useEffect(() => {
    const ment = mentInfos.find(
      (ment) => `'${ment.defineId}'` === watchRetryMent,
    )
    setMentDesc(ment?.property.desc ?? '')
  }, [mentInfos, watchRetryMent])

  useEffect(() => {
    if (watchTimeoutTracking && watchInputTracking && watchRetryTracking) {
      setValue('menuOpt.errorInfo.tracking', true)
    } else {
      setValue('menuOpt.errorInfo.tracking', false)
    }
  }, [watchTimeoutTracking, watchInputTracking, watchRetryTracking, setValue])

  return (
    <div className="flex h-full w-full">
      <div className="w-full space-y-6 p-6">
        <div className="space-y-3">
          <h3>Top Key</h3>
          <FormAutocomplete
            control={control}
            name="menuOpt.topKey"
            selectOptions={SELECT_CONDITION_OPTIONS}
          />
          {errors.menuOpt?.topKey && (
            <span className="error-msg">{errors.menuOpt.topKey.message}</span>
          )}
          <h3>Up Key</h3>
          <FormAutocomplete
            control={control}
            name="menuOpt.upKey"
            selectOptions={SELECT_CONDITION_OPTIONS}
          />
          {errors.menuOpt?.upKey && (
            <span className="error-msg">{errors.menuOpt.upKey.message}</span>
          )}
          <h3>Timeout</h3>
          <FormAutocomplete
            control={control}
            name="menuOpt.timeout"
            selectOptions={TIMEOUT_OPTIONS_0_10}
          />
          {errors.menuOpt?.timeout && (
            <span className="error-msg">{errors.menuOpt.timeout.message}</span>
          )}
          <h3>Retry</h3>
          <FormAutocomplete
            control={control}
            name="menuOpt.retry"
            selectOptions={TIMEOUT_OPTIONS_10}
          />
          {errors.menuOpt?.retry && (
            <span className="error-msg">{errors.menuOpt.retry.message}</span>
          )}
        </div>
        <Separator />
        <div className="space-y-3">
          <h2>Error Ment</h2>
          <FormCheckbox
            control={control}
            name="menuOpt.errorInfo.clearDigit"
            label="Clear Digit Error Ment"
          />
          <div className="space-x-3">
            <Checkbox
              id="tracking"
              checked={watchTracking}
              onCheckedChange={(checked) => {
                setValue('menuOpt.errorInfo.tracking', !!checked)
                setValue('menuOpt.errorInfo.timeout.tracking', !!checked)
                setValue('menuOpt.errorInfo.input.tracking', !!checked)
                setValue('menuOpt.errorInfo.retry.tracking', !!checked)
              }}
            />
            <Label htmlFor="tracking">Tracking Error Ment</Label>
          </div>
          <h3>Timeout</h3>
          <div className="flex gap-3">
            <FormAutocomplete
              control={control}
              name="menuOpt.errorInfo.timeout.ment"
              selectOptions={mentOptions}
            />
            <PlayButton />
            <FormCheckbox
              control={control}
              name="menuOpt.errorInfo.timeout.tracking"
              label="Tracking"
            />
          </div>
          <h3>Input</h3>
          <div className="flex gap-3">
            <FormAutocomplete
              control={control}
              name="menuOpt.errorInfo.input.ment"
              selectOptions={mentOptions}
            />
            <PlayButton />
            <FormCheckbox
              control={control}
              name="menuOpt.errorInfo.input.tracking"
              label="Tracking"
            />
          </div>
          <h3>Retry</h3>
          <div className="flex gap-3">
            <FormAutocomplete
              control={control}
              name="menuOpt.errorInfo.retry.ment"
              selectOptions={mentOptions}
            />
            <PlayButton />
            <FormCheckbox
              control={control}
              name="menuOpt.errorInfo.retry.tracking"
              label="Tracking"
            />
          </div>
          <Input value={mentDesc} readOnly={true} onChange={() => {}} />
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="w-full space-y-6 p-6">
        <div className="space-y-3">
          <h3>Terminate Flow</h3>
          <div className="flex">
            <FormAutocomplete
              control={control}
              name="menuOpt.termFlowId"
              selectOptions={subFlowOptions}
            />
            <Button variant="secondary3" onClick={handleOpen}>
              Open
            </Button>
            <Button variant="secondary3" onClick={handleCreate}>
              Create
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <h3>Menu Filter</h3>
          {menuFilterArray.map((value, index) => (
            <div key={index} className="flex gap-3">
              <Checkbox
                id={`filter${index + 1}`}
                checked={value === '1'}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(index, !!checked)
                }
              />
              <Label htmlFor={`filter${index + 1}`}>
                {renderLabel(index + 1, data.menuFilter)}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
