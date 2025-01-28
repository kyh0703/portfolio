'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormCheckbox from '@/app/_components/form-checkbox'
import FormInput from '@/app/_components/form-input'
import FormSelect from '@/app/_components/form-select'
import { Input } from '@/app/_components/input'
import PlayButton from '@/app/_components/play-button'
import { SelectItem } from '@/app/_components/select'
import {
  DTMF_LENGTH_OPTIONS,
  DTMF_OPTIONS,
  MENT_TYPE_OPTIONS,
  SET_MENT_OPTIONS,
} from '@/constants/options'
import type { DefineMent, DefineMenu, MenuCheckOption } from '@/models/define'
import type { SubFlowList } from '@/models/subflow-list'
import { useAddSubFlow } from '@/services/flow'
import type { DefineList } from '@/types/define'
import { Separator } from '@/ui/separator'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'

type MenuTabProps = {
  isFirstCreated: boolean
  subFlowList: SubFlowList[]
  mentInfos: DefineList<DefineMent>[]
  checkOption: MenuCheckOption
}

export default function MenuTab({
  isFirstCreated,
  subFlowList,
  mentInfos,
  checkOption,
}: MenuTabProps) {
  const router = useRouter()
  const [mentDesc, setMentDesc] = useState({
    caption: '',
    choice: '',
  })

  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<DefineMenu>()
  const [
    watchSubFlowName,
    watchCaptionMent,
    watchCaptionMentType,
    watchChoiceMent,
    watchChoiceMentType,
  ] = useWatch({
    control,
    name: [
      'subFlowName',
      'capMent.ment',
      'capMent.type',
      'choiceMent.ment',
      'choiceMent.type',
    ],
  })

  const { mutate: addSubFlowMutate } = useAddSubFlow()

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
    if (!subFlowOptions.find((subCall) => subCall === watchSubFlowName)) {
      toast.warn('SubCall을 찾을 수 없습니다.')
      return
    }

    const subFlowId = subFlowList.find(
      (subCall) => subCall.name === watchSubFlowName,
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
    const ment = mentInfos.find(
      (ment) => `'${ment.defineId}'` === watchCaptionMent,
    )
    setMentDesc((desc) => ({
      ...desc,
      caption: ment?.property.desc || '',
    }))
  }, [mentInfos, watchCaptionMent])

  useEffect(() => {
    const ment = mentInfos.find(
      (ment) => `'${ment.defineId}'` === watchChoiceMent,
    )
    setMentDesc((desc) => ({
      ...desc,
      choice: ment?.property.desc || '',
    }))
  }, [mentInfos, watchChoiceMent])

  return (
    <div className="flex h-full min-h-0 w-full overflow-auto">
      <div className="w-full space-y-6 p-6">
        <div className="space-y-3">
          <h3>ID</h3>
          <FormInput control={control} name="id" />
          {errors.id && <span className="error-msg">{errors.id.message}</span>}
          <h3>Name</h3>
          <FormInput control={control} name="name" disabled={!isFirstCreated} />
          {errors.name && (
            <span className="error-msg">{errors.name.message}</span>
          )}
          <h3>Service Code</h3>
          <FormAutocomplete
            control={control}
            name="svcCode"
            selectOptions={[]}
          />
          <h3>DTMF</h3>
          <div className="flex gap-3 text-nowrap">
            <FormAutocomplete
              control={control}
              name="dtmf"
              selectOptions={DTMF_OPTIONS}
            />
            <FormCheckbox control={control} name="custom" label="Custom Menu" />
          </div>
          {errors.dtmf && (
            <span className="error-msg">{errors.dtmf.message}</span>
          )}
        </div>
        <Separator />
        <div className="space-y-3">
          <h3>Caption Ment</h3>
          <div className="flex gap-3">
            <FormAutocomplete
              control={control}
              name="capMent.ment"
              selectOptions={mentOptions}
            />
            <PlayButton />
          </div>
          <Input value={mentDesc.caption} readOnly={true} onChange={() => {}} />
          <h3>Type</h3>
          <div className="flex gap-3">
            <FormSelect control={control} name="capMent.type">
              {SET_MENT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </FormSelect>
            <FormCheckbox
              control={control}
              name="capMent.tracking"
              label="Tracking"
            />
          </div>
          {(errors.capMent as any)?.type && (
            <span className="error-msg">
              {(errors.capMent as any).type.message}
            </span>
          )}
          <h3>Country</h3>
          <FormSelect
            control={control}
            name="capMent.ttsInfo.country"
            disabled={
              !['TTS-Stream', 'TTS-File'].includes(watchCaptionMentType ?? '')
            }
          >
            {['KOREA, REPUBLIC OF'].map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </FormSelect>
          <h3>Speaker ID</h3>
          <FormInput
            control={control}
            name="capMent.ttsInfo.speakerId"
            disabled={
              !['TTS-Stream', 'TTS-File'].includes(watchCaptionMentType ?? '')
            }
          />
          <h3>TTS Name</h3>
          {/* TODO: 운영관리 TTS 서버 목록과 연동된다면 콤보박스 버튼을 누르면 리스팅한다 */}
          <FormAutocomplete
            control={control}
            name="capMent.ttsInfo.name"
            selectOptions={
              // TODO: SWAT에 등록된 TTS 서버 목록을 가져와야 함
              []
            }
            disabled={
              !['TTS-Stream', 'TTS-File'].includes(watchCaptionMentType ?? '')
            }
          />
        </div>
        <Separator />
        <div className="space-y-3">
          <h3>SubFlow</h3>
          <div className="flex gap-3">
            <FormAutocomplete
              control={control}
              name="subFlowName"
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
          <h3>Choice Ment</h3>
          <div className="flex gap-3">
            <FormAutocomplete
              control={control}
              name="choiceMent.ment"
              selectOptions={mentOptions}
            />
            <PlayButton />
          </div>
          <Input value={mentDesc.choice} readOnly={true} onChange={() => {}} />
          <h3>Type</h3>
          <div className="flex gap-3">
            <FormSelect control={control} name="choiceMent.type">
              {MENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </FormSelect>
            <FormCheckbox
              control={control}
              name="choiceMent.tracking"
              label="Tracking"
            />
          </div>
          {(errors.choiceMent as any)?.type && (
            <span className="error-msg">
              {(errors.choiceMent as any).type.message}
            </span>
          )}
          <h3>Country</h3>
          <FormSelect
            control={control}
            name="choiceMent.ttsInfo.country"
            disabled={
              !['TTS-Stream', 'TTS-File'].includes(watchChoiceMentType ?? '')
            }
          >
            {['KOREA, REPUBLIC OF'].map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </FormSelect>
          <h3>Speaker ID</h3>
          <FormInput
            control={control}
            name="choiceMent.ttsInfo.speakerId"
            disabled={
              !['TTS-Stream', 'TTS-File'].includes(watchChoiceMentType ?? '')
            }
          />
          <h3>TTS Name</h3>
          {/* TODO: 운영관리 TTS 서버 목록과 연동된다면 콤보박스 버튼을 누르면 리스팅한다 */}
          <FormAutocomplete
            control={control}
            name="choiceMent.ttsInfo.name"
            selectOptions={[]}
            disabled={
              !['TTS-Stream', 'TTS-File'].includes(watchChoiceMentType ?? '')
            }
          />
        </div>
        <Separator />
        <div className="space-y-3">
          <h3>DTMF Mask</h3>
          <FormInput control={control} name="dtmfMask" />
          <h3>DTMF Length</h3>
          <FormAutocomplete
            control={control}
            name="length"
            selectOptions={DTMF_LENGTH_OPTIONS}
          />
          {errors.length && (
            <span className="error-msg">{errors.length.message}</span>
          )}
          <h3>Play Index</h3>
          <FormAutocomplete
            control={control}
            name="playIndex"
            selectOptions={[]}
          />
          <h3>Retry DTMF</h3>
          <FormAutocomplete
            control={control}
            name="retryDtmf"
            selectOptions={DTMF_OPTIONS}
          />
          <h3>Condition</h3>
          <FormInput control={control} name="condition" />
          {errors.condition && (
            <span className="error-msg">{errors.condition.message}</span>
          )}
        </div>
      </div>
    </div>
  )
}
