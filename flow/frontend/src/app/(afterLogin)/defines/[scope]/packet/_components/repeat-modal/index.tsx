'use client'

import { Button } from '@/app/_components/button'
import FormCheckbox from '@/app/_components/form-checkbox'
import FormInput from '@/app/_components/form-input'
import FormSelect from '@/app/_components/form-select'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { SelectItem } from '@/app/_components/select'
import {
  ALIGN_OPTIONS,
  DEFINE_PACKET_ENCODE_OPTIONS,
  TRIM_OPTIONS,
} from '@/constants/options'
import { useModalId } from '@/contexts/modal-context'
import type { PacketFormat } from '@/models/define'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, type FormEventHandler } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const typeOptions = [
  'ItemRepeatS',
  'ItemRepeatS2',
  'ItemRepeatS3',
  'ItemRepeatS4',
  'ItemRepeatS5',
  'ItemRepeatS6',
  'ItemRepeatS7',
  'ItemRepeatS8',
  'ItemRepeatS9',
  'ItemRepeatR',
  'ItemRepeatR2',
  'ItemRepeatR3',
  'ItemRepeatR4',
  'ItemRepeatR5',
  'ItemRepeatR6',
  'ItemRepeatR7',
  'ItemRepeatR8',
  'ItemRepeatR9',
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
  data?: PacketFormat
}

export default function RepeatModal({
  onSubmit,
}: {
  onSubmit?: (mode: 'create' | 'update', data: PacketFormat) => void
}) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const {
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PacketFormat>({
    defaultValues: modalData?.data || {
      type: 'ItemRepeatS',
      name: '',
      length: '1',
      fill: '',
      align: 'left',
      default: '',
      cntName: '',
      desc: '',
      encrypt: false,
      numeric: false,
      pattern: '',
      trim: '',
      encode: '',
      respCode: false,
    },
    resolver: yupResolver(schema),
  })
  const watchNumeric = watch('numeric')

  useEffect(() => {
    if (watchNumeric) {
      setValue('fill', '0')
      setValue('align', 'right')
    } else {
      setValue('fill', '')
      setValue('align', 'left')
    }
  }, [setValue, watchNumeric])

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  const onSubmitForm = (data: PacketFormat) => {
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
            <h3>Fill</h3>
            <FormInput control={control} name="fill" />
          </div>
          <div className="space-y-3">
            <h3>Align</h3>
            <FormSelect control={control} name="align">
              {ALIGN_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </FormSelect>
          </div>
          <div className="space-y-3">
            <h3>Default</h3>
            <FormInput control={control} name="default" />
          </div>
          <div className="space-y-3">
            <h3>Desc</h3>
            <FormInput control={control} name="desc" />
          </div>
          <div className="space-y-3">
            <FormCheckbox control={control} name="encrypt" label="Encrypt" />
            <FormCheckbox control={control} name="numeric" label="Is Numeric" />
          </div>
          <div className="space-y-3">
            <h3>Pattern</h3>
            <FormInput control={control} name="pattern" />
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
            <h3>Encode</h3>
            <FormSelect control={control} name="encode">
              {DEFINE_PACKET_ENCODE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </FormSelect>
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
