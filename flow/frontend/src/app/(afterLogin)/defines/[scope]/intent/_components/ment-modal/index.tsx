'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormCheckbox from '@/app/_components/form-checkbox'
import FormInput from '@/app/_components/form-input'
import FormSelect from '@/app/_components/form-select'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import PlayButton from '@/app/_components/play-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { Textarea } from '@/app/_components/textarea'
import {
  CHAT_INFO_NLU_CATEGORY_OPTIONS,
  MENT_COUNTRY_OPTIONS,
  MENT_TYPE_OPTIONS,
} from '@/constants/options'
import { useModalId } from '@/contexts/modal-context'
import { DefineMent, type MentList } from '@/models/define'
import { useQueryDefines } from '@/services/define'
import { useModalStore } from '@/store/modal'
import logger from '@/utils/logger'
import { removeDuplicateDefines } from '@/utils/options'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useState, type FormEventHandler } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const schema = Yup.object().shape({
  kind: Yup.string().required('Kind를 입력해주세요'),
  expression: Yup.string().required('Expression을 입력해주세요'),
  type: Yup.string().required('Type을 입력해주세요'),
  condition: Yup.string().required('Condition을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: MentList
}

export default function MentModal({
  onSubmit,
}: {
  onSubmit?: (mode: 'create' | 'update', data: MentList) => void
}) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )
  const [mentDesc, setMentDesc] = useState<string>('')

  const { data: mentOptions } = useSuspenseQuery({
    ...useQueryDefines<DefineMent>('ment'),
    select: (data) => removeDuplicateDefines(data),
  })

  const {
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<MentList>({
    defaultValues: modalData?.data || {
      kind: CHAT_INFO_NLU_CATEGORY_OPTIONS[0],
      expression: '',
      type: 'MentID',
      ttsInfo: { country: '', speakerId: '', name: '' },
      clearDigit: false,
      ignoreDtmf: false,
      tracking: false,
      condition: '1',
    },
    resolver: yupResolver(schema),
  })

  logger.debug('errors', errors)
  const [watchExpression, watchType] = useWatch({
    control,
    name: ['expression', 'type'],
  })

  useEffect(() => {
    if (modalData?.data && !['MentID', 'File'].includes(watchType)) {
      setMentDesc(modalData.data.expression)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    switch (watchType) {
      case 'MentID':
        const ment = mentOptions.find(
          ({ property: { id } }) => `'${id}'` === watchExpression,
        )
        setMentDesc(ment?.property.desc ?? '')
        if (!watchExpression && mentDesc) {
          setValue('expression', mentDesc)
        }
        setValue('ttsInfo.country', '')
        break
      case 'File':
        setValue('ttsInfo.country', '')
        break
      default:
        setValue('ttsInfo.country', 'KOREA, REPUBLIC OF')
    }
  }, [mentDesc, mentOptions, setValue, watchExpression, watchType])

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  const onSubmitForm = (data: MentList) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData.mode, data)
  }

  const handleModalSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.stopPropagation()
    handleSubmit(onSubmitForm)(event)
  }

  return (
    <form onSubmit={handleModalSubmit}>
      <ModalContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3>Kind</h3>
            <Select>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHAT_INFO_NLU_CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <h3>Expression [Ment ID]</h3>
            <div className="flex gap-1.5">
              <FormAutocomplete
                control={control}
                name="expression"
                selectOptions={mentOptions.map(
                  ({ property: { id, desc } }) => ({
                    label: `'${id}' - "${desc}"`,
                    value: `'${id}'`,
                  }),
                )}
                disabled={!['MentID', 'File'].includes(watchType)}
                autoFocus
              />
              <PlayButton />
            </div>
            {['MentID', 'File'].includes(watchType) ? (
              <Textarea
                value={mentDesc}
                rows={3}
                readOnly={true}
                onChange={() => {}}
              />
            ) : (
              <FormAutocomplete control={control} name="expression" rows={3} />
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
          </div>
          <div className="space-y-3">
            <h3>Country</h3>
            <FormSelect
              control={control}
              name="ttsInfo.country"
              disabled={!['TTS-Stream', 'TTS-File'].includes(watchType)}
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
            <FormInput
              control={control}
              name="ttsInfo.speakerId"
              disabled={!['TTS-Stream', 'TTS-File'].includes(watchType)}
            />
          </div>
          <div className="space-y-3">
            <h3>TTS Name</h3>
            {/* TODO: 운영관리 TTS 서버 목록과 연동된다면 콤보박스 버튼을 누르면 리스팅한다 */}
            <FormAutocomplete
              control={control}
              name="ttsInfo.name"
              selectOptions={[]}
              disabled={!['TTS-Stream', 'TTS-File'].includes(watchType)}
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
            </div>
          </div>
          <div className="space-y-3">
            <h3>Condition</h3>
            <FormInput control={control} name="condition" />
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
