'use client'

import { Button } from '@/app/_components/button'
import { Checkbox } from '@/app/_components/checkbox'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormCheckbox from '@/app/_components/form-checkbox'
import Label from '@/app/_components/label'
import PlayButton from '@/app/_components/play-button'
import { SCORE_OPTIONS_100 } from '@/constants/options'
import type { DefineMent, DefineMenu, MenuCheckOption } from '@/models/define'
import type { SubFlowList } from '@/models/subflow-list'
import { useAddSubFlow } from '@/services/flow'
import type { DefineList } from '@/types/define'
import { Separator } from '@/ui/separator'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'

type VRActionTabProps = {
  mentInfos: DefineList<DefineMent>[]
  subFlowList: SubFlowList[]
  checkOption: MenuCheckOption
}

export default function VRActionTab({
  mentInfos,
  subFlowList,
  checkOption,
}: VRActionTabProps) {
  const router = useRouter()
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<DefineMenu>()

  const { mutate: addSubFlowMutate } = useAddSubFlow()

  const [
    watchSubFlowName,
    watchTracking,
    watchTimeoutTracking,
    watchInputTracking,
    watchRetryTracking,
  ] = useWatch({
    control,
    name: [
      'vrAct.recog.subFlowName',
      'vrAct.errorInfo.tracking',
      'vrAct.errorInfo.timeout.tracking',
      'vrAct.errorInfo.input.tracking',
      'vrAct.errorInfo.retry.tracking',
    ],
  })

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

  const handleOpen = () => {
    if (!subFlowOptions.find((subFlow) => subFlow === watchSubFlowName)) {
      toast.warn('SubFlow를 찾을 수 없습니다.')
      return
    }

    const subFlowId = subFlowList.find(
      (subFlow) => subFlow.name === watchSubFlowName,
    )!.id

    router.push(`/subflows/${subFlowId}`)
  }

  const handleCreate = () => {
    if (!watchSubFlowName) {
      toast.warn('SubFlow 이름을 입력해주세요.')
      return
    }

    if (!subFlowOptions.find((subCall) => subCall === watchSubFlowName)) {
      addSubFlowMutate(
        {
          name: watchSubFlowName!,
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
        (subFlow) => subFlow.name === watchSubFlowName,
      )!.id
      router.push(`/subflows/${subFlowId}`)
    }
  }

  useEffect(() => {
    if (watchTimeoutTracking && watchInputTracking && watchRetryTracking) {
      setValue('vrAct.errorInfo.tracking', true)
    } else {
      setValue('vrAct.errorInfo.tracking', false)
    }
  }, [watchTimeoutTracking, watchInputTracking, watchRetryTracking, setValue])

  return (
    <div className="flex h-full w-full">
      <div className="w-full space-y-6 p-6">
        <div className="space-y-3">
          <h2>Recognition Action</h2>
          <h3>Confidence Score High</h3>
          <FormAutocomplete
            control={control}
            name="vrAct.recog.highScore"
            selectOptions={SCORE_OPTIONS_100}
          />
          {errors.vrAct?.recog?.highScore && (
            <span className="error-msg">
              {errors.vrAct.recog.highScore.message}
            </span>
          )}
          <h3>Confidence Score Low</h3>
          <FormAutocomplete
            control={control}
            name="vrAct.recog.lowScore"
            selectOptions={SCORE_OPTIONS_100}
          />
          {errors.vrAct?.recog?.lowScore && (
            <span className="error-msg">
              {errors.vrAct.recog.lowScore.message}
            </span>
          )}
          <FormCheckbox
            control={control}
            name="vrAct.recog.proDTMF"
            label="Process DTMF"
          />
          <h3>Flow for Result</h3>
          <div className="flex gap-3">
            <FormAutocomplete
              control={control}
              name="vrAct.recog.subFlowName"
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
      </div>
      <Separator orientation="vertical" />
      <div className="w-full space-y-6 p-6">
        <div className="space-y-3">
          <h2>Error Ment</h2>
          <FormCheckbox
            control={control}
            name="vrAct.errorInfo.clearDigit"
            label="Clear Digit Ment"
          />
          <div className="space-x-3">
            <Checkbox
              id="tracking"
              checked={watchTracking}
              onCheckedChange={(checked) => {
                setValue('vrAct.errorInfo.tracking', !!checked)
                setValue('vrAct.errorInfo.timeout.tracking', !!checked)
                setValue('vrAct.errorInfo.input.tracking', !!checked)
                setValue('vrAct.errorInfo.retry.tracking', !!checked)
              }}
            />
            <Label htmlFor="tracking">Tracking Error Ment</Label>
          </div>
          <h3>VR Timeout</h3>
          <div className="flex gap-3">
            <FormAutocomplete
              control={control}
              name="vrAct.errorInfo.timeout.ment"
              selectOptions={mentOptions}
            />
            <PlayButton />
            <FormCheckbox
              control={control}
              name="vrAct.errorInfo.timeout.tracking"
              label="Tracking"
            />
          </div>
          <h3>VR Input</h3>
          <div className="flex gap-3">
            <FormAutocomplete
              control={control}
              name="vrAct.errorInfo.input.ment"
              selectOptions={mentOptions}
            />
            <PlayButton />
            <FormCheckbox
              control={control}
              name="vrAct.errorInfo.input.tracking"
              label="Tracking"
            />
          </div>
          <h3>VR Retry</h3>
          <div className="flex gap-3">
            <FormAutocomplete
              control={control}
              name="vrAct.errorInfo.retry.ment"
              selectOptions={mentOptions}
            />
            <PlayButton />
            <FormCheckbox
              control={control}
              name="vrAct.errorInfo.retry.tracking"
              label="Tracking"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
