'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import FormSelect from '@/app/_components/form-select'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { SelectItem } from '@/app/_components/select'
import { TRIM_OPTIONS } from '@/constants/options'
import { useModalId } from '@/contexts/modal-context'
import type { StringFormat } from '@/models/define'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { type FormEventHandler } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const typeOptions = [
  'ItemRepeatF1',
  'ItemRepeatF2',
  'ItemRepeatF3',
  'ItemRepeatF4',
  'ItemRepeatF5',
  'ItemRepeatF6',
  'ItemRepeatF7',
  'ItemRepeatF8',
  'ItemRepeatF9',
]

const schema = Yup.object().shape({
  type: Yup.string().required('Type을 입력해주세요'),
  name: Yup.string().required('Name을 입력해주세요'),
  length: Yup.string().when({
    is: () => true,
    then: (schema) =>
      schema
        .required('Length is required')
        .matches(/^[1-9]\d*$/, '1 이상의 숫자를 입력해주세요.'),
  }),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: StringFormat
}

export default function RepeatModal({
  onSubmit,
}: {
  onSubmit?: (mode: 'create' | 'update', data: StringFormat) => void
}) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<StringFormat>({
    defaultValues: modalData?.data || {
      type: typeOptions[0],
      name: '',
      length: '1',
      cntName: '',
      trim: '',
      desc: '',
    },
    resolver: yupResolver(schema),
  })

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  const onSubmitForm = (data: StringFormat) => {
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
            <h3>Type</h3>
            <FormSelect control={control} name="type">
              {typeOptions.map((option) => (
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
            <h3>Name</h3>
            <FormInput control={control} name="name" autoFocus />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Length</h3>
            <FormInput control={control} name="length" />
            {errors.length && (
              <span className="error-msg">{errors.length.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Trim</h3>
            <FormSelect control={control} name="trim">
              {TRIM_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </FormSelect>
          </div>
          <div className="space-y-3">
            <h3>Desc</h3>
            <FormInput control={control} name="desc" />
            {errors.desc && (
              <span className="error-msg">{errors.desc.message}</span>
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
