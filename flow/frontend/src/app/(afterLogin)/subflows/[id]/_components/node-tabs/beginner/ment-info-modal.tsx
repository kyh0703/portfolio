'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormCheckbox from '@/app/_components/form-checkbox'
import FormSelect from '@/app/_components/form-select'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import PlayButton from '@/app/_components/play-button'
import { SelectItem } from '@/app/_components/select'
import { Textarea } from '@/app/_components/textarea'
import { ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE } from '@/constants/error-message'
import {
  CHAT_INFO_NLU_CATEGORY_EMPTY_OPTIONS,
  MENT_COUNTRY_OPTIONS,
  MENT_TYPE_OPTIONS,
} from '@/constants/options'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineMent } from '@/models/define'
import { MentColumnType } from '@/models/property/common'
import { useQueryDefines } from '@/services/define'
import { useModalStore } from '@/store/modal'
import { validateVarExpression } from '@/utils'
import { removeDuplicateDefines } from '@/utils/options'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../../node-properties/types'

const schema = Yup.object().shape({
  expression: Yup.string()
    .required('Expression을 입력해주세요')
    .test(
      'expression',
      ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
      validateVarExpression,
    ),
  type: Yup.string().required('Type을 입력해주세요'),
  condition: Yup.string()
    .required('Condition을 입력해주세요')
    .test(
      'expression',
      ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
      validateVarExpression,
    ),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: MentColumnType
  rowIndex?: number
}

export default function BeginnerMentInfoModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (
    mode: 'create' | 'update',
    data: MentColumnType,
    rowIndex?: number,
  ) => void
}) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )
  const [options, _, onValueChange] = useAutocomplete({ ...tabProps })
  const [mentDesc, setMentDesc] = useState<string>('')

  const { data: ments } = useSuspenseQuery({
    ...useQueryDefines<DefineMent>('ment'),
    select: (data) => removeDuplicateDefines(data),
  })

  const {
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<MentColumnType>({
    defaultValues: modalData?.data || {
      kind: 'QUESTION',
      expression: '',
      type: 'MentID',
      ttsInfo: {
        country: 'KOREA, REPUBLIC OF',
        speakerId: '',
        ttsName: '',
      },
      clearDigit: false,
      ignoreDtmf: false,
      tracking: false,
      async: false,
      condition: '1',
    },
    resolver: yupResolver(schema),
  })

  const [watchExpression, watchType] = watch(['expression', 'type'])

  useEffect(() => {
    if (watchType === 'MentID' || watchType === 'File') {
      setValue('ttsInfo.country', '')
    } else {
      setValue('ttsInfo.country', 'KOREA, REPUBLIC OF')
      mentDesc && setValue('expression', `'${mentDesc}'`)
    }
  }, [mentDesc, setValue, watchType])

  useEffect(() => {
    const ment = ments.find((ment) => `'${ment.defineId}'` === watchExpression)
    setMentDesc(ment?.property.desc || '')
  }, [ments, watchExpression])

  const onSubmitForm = (data: MentColumnType) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData.mode, data, modalData.rowIndex)
  }

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  const handlekeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} onKeyDown={handlekeyDown}>
      <ModalContent>
        <div className="space-y-6">
          {tabProps.nodeType === 'NLURequest' && (
            <div className="space-y-3">
              <h3>Kind</h3>
              <FormSelect control={control} name="kind">
                {CHAT_INFO_NLU_CATEGORY_EMPTY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </FormSelect>
              {errors.type && (
                <span className="error-msg">{errors.type.message}</span>
              )}
            </div>
          )}
          <div className="space-y-3">
            <h3>Expression [Ment ID]</h3>
            <div className="flex gap-1.5">
              <FormAutocomplete
                control={control}
                name="expression"
                options={options}
                selectOptions={ments.map((ment) => ({
                  label: `'${ment.defineId}' - "${ment.property.desc}"`,
                  value: `'${ment.defineId}'`,
                }))}
                disabled={!['MentID', 'File'].includes(watchType)}
                autoFocus
                onValueChange={onValueChange}
              />
              <PlayButton disabled={!watchExpression} />
            </div>
            {['MentID', 'File'].includes(watchType) ? (
              <Textarea
                value={mentDesc}
                rows={3}
                readOnly={true}
                onChange={() => {}}
              />
            ) : (
              <FormAutocomplete
                control={control}
                name="expression"
                rows={3}
                options={options}
                onValueChange={onValueChange}
              />
            )}
            {errors.expression && (
              <span className="error-msg">{errors.expression.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Type</h3>
            <FormSelect control={control} name="type">
              {MENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </FormSelect>
            {errors.type && (
              <span className="error-msg">{errors.type.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Country</h3>
            <FormSelect
              control={control}
              name="ttsInfo.country"
              disabled={['MentID', 'File'].includes(watchType)}
            >
              {MENT_COUNTRY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </FormSelect>
          </div>
          <div className="space-y-3">
            <h3>Speaker ID</h3>
            <FormAutocomplete
              control={control}
              name="ttsInfo.speakerId"
              options={options}
              disabled={!['TTS-Stream', 'TTS-File'].includes(watchType)}
              onValueChange={onValueChange}
            />
          </div>
          <div className="space-y-3">
            <h3>TTS Name</h3>
            <FormAutocomplete
              control={control}
              name="ttsInfo.ttsName"
              options={options}
              selectOptions={
                // TODO: 운영관리 TTS 서버 목록과 연동된다면 콤보박스 버튼을 누르면 리스팅한다
                []
              }
              disabled={!['TTS-Stream', 'TTS-File'].includes(watchType)}
              onValueChange={onValueChange}
            />
            <div className="space-y-3">
              <FormCheckbox
                control={control}
                name="clearDigit"
                label="Clear Digit"
              />
              <FormCheckbox
                control={control}
                name="ignoreDtmf"
                label="Ignore DTMF"
              />
              <FormCheckbox
                control={control}
                name="tracking"
                label="Tracking"
              />
              {tabProps.nodeType === 'Play' && (
                <FormCheckbox
                  control={control}
                  name="async"
                  label="Async Play"
                />
              )}
            </div>
          </div>
          <div className="space-y-3">
            <h3>Condition</h3>
            <FormAutocomplete
              control={control}
              name="condition"
              options={options}
              onValueChange={onValueChange}
            />
            {errors.condition && (
              <span className="error-msg">{errors.condition.message}</span>
            )}
          </div>
        </div>
      </ModalContent>
      <ModalAction>
        <Button variant="error" onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button type="submit">OK</Button>
      </ModalAction>
    </form>
  )
}
