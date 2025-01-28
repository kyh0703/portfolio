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
import { DefinePacket, type PacketFormat } from '@/models/define'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState, type FormEventHandler } from 'react'
import { useForm, useFormContext, type SubmitHandler } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const schema = Yup.object().shape({
  type: Yup.string().required('Type을 입력해주세요'),
  name: Yup.string().required('Name을 입력해주세요'),
  length: Yup.string().when('type', {
    is: (type: string) => !type.includes('Repeat'),
    then: (schema) =>
      schema
        .required('Length를 입력해주세요')
        .matches(/^[1-9]\d*$/, '1 이상의 숫자를 입력해주세요.'),
    otherwise: (schema) => schema,
  }),
  cntName: Yup.string().when('type', {
    is: (type: string) => type.includes('Repeat'),
    then: (schema) => schema.required('CntName을 입력해주세요'),
    otherwise: (schema) => schema,
  }),
})

const getCntNameOptions = (rows?: PacketFormat[]): string[] => {
  const assignCntName = rows
    ?.filter((row) => row.type.includes('Repeat'))
    .map((row) => row.cntName)
  const notAssignName = rows
    ?.filter((row) => !assignCntName?.includes(row.name) && row.type === 'Item')
    .map((row) => row.name)
  return notAssignName ?? []
}

const getCntNameOptionsByRowIndex = (
  rowIndex: number,
  rows?: PacketFormat[],
): string[] => {
  const assignCntName = rows
    ?.filter((row) => row.type.includes('Repeat'))
    .map((row) => row.cntName)
  const notAssignName = rows
    ?.filter(
      (row, index) =>
        !assignCntName?.includes(row.name) &&
        row.type === 'Item' &&
        index < rowIndex,
    )
    .map((row) => row.name)

  return notAssignName ?? []
}

const getRepeatTypeOptions = (
  rows?: PacketFormat[],
  repeat?: PacketFormat[],
): string[] => {
  // NOTE: RepeatS1 => Repeat1
  const filterRepeatS = Array.from(
    new Set(
      repeat
        ?.filter((row) => row.type.includes('RepeatS'))
        .map((row) => row.type.replace('RepeatS', 'Repeat')),
    ),
  )

  const notAssign = filterRepeatS.filter(
    (row) => !rows?.some((r) => r.type === row),
  )

  return ['Item', ...notAssign]
}

type ModalData = {
  mode: 'create' | 'update'
  data?: PacketFormat
  rowIndex?: number
}

export default function SendModal({
  onSubmit,
}: {
  onSubmit?: (mode: 'create' | 'update', data: PacketFormat) => void
}) {
  const { getValues } = useFormContext<DefinePacket>()

  const rows = getValues('sndPart')
  const repeat = getValues('rptPart')

  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )
  const [typeOptions, setTypeOptions] = useState<string[]>([])
  const [cntNameOptions, setCntNameOptions] = useState<string[]>([])

  const {
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PacketFormat>({
    defaultValues: modalData?.data || {
      type: 'Item',
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
  const [watchType, watchNumeric] = watch(['type', 'numeric'])

  useEffect(() => {
    switch (modalData?.mode) {
      case 'create': {
        const notAssignCntName = getCntNameOptions(rows)
        setCntNameOptions(notAssignCntName)
        const notAssignRepeat = getRepeatTypeOptions(rows, repeat)
        setTypeOptions(notAssignRepeat)
        break
      }
      case 'update': {
        const notAssignCntName = getCntNameOptionsByRowIndex(
          modalData.rowIndex!,
          rows,
        )
        setCntNameOptions(
          modalData.data?.cntName
            ? [modalData.data?.cntName, ...notAssignCntName]
            : notAssignCntName,
        )
        const notAssignRepeat = getRepeatTypeOptions(rows, repeat)
        setTypeOptions(
          modalData.data?.type.includes('Repeat')
            ? [modalData.data?.type, ...notAssignRepeat]
            : notAssignRepeat,
        )
        break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (watchNumeric) {
      setValue('fill', '0')
      setValue('align', 'right')
    } else {
      setValue('fill', '')
      setValue('align', 'left')
    }
  }, [setValue, watchNumeric])

  useEffect(() => {
    if (watchType.includes('Repeat')) {
      setValue('fill', '')
      setValue('length', '')
    } else {
      setValue('cntName', '')
    }
  }, [setValue, watchType])

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  const onSubmitForm: SubmitHandler<PacketFormat> = (data) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData.mode, data as PacketFormat)
  }

  const handleModalSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.stopPropagation()
    handleSubmit(onSubmitForm)(event)
  }

  return (
    <form onSubmit={handleModalSubmit}>
      <ModalContent>
        <div className="space-y-3">
          <div className="space-y-3">
            <FormCheckbox control={control} name="encrypt" label="Encrypt" />
            <FormCheckbox control={control} name="numeric" label="Is Numeric" />
          </div>
          <div className="space-y-6">
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
          <div className="space-y-6">
            <h3>Name</h3>
            <FormInput control={control} name="name" autoFocus />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          {watchType.includes('Repeat') ? (
            <div className="space-y-6">
              <h3>Count Name</h3>
              <FormSelect control={control} name="cntName">
                {cntNameOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </FormSelect>
              {errors.cntName && (
                <span className="error-msg">{errors.cntName.message}</span>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <h3>Length</h3>
                <FormInput control={control} name="length" />
                {errors.length && (
                  <span className="error-msg">{errors.length.message}</span>
                )}
              </div>
              <div className="space-y-6">
                <h3>Fill</h3>
                <FormInput control={control} name="fill" />
              </div>
              <div className="space-y-6">
                <h3>Align</h3>
                <FormSelect control={control} name="align">
                  {ALIGN_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </FormSelect>
              </div>
              <div className="space-y-6">
                <h3>Default</h3>
                <FormInput control={control} name="default" />
              </div>
              <div className="space-y-6">
                <h3>Desc</h3>
                <FormInput control={control} name="desc" />
              </div>
              <div className="space-y-6">
                <h3>Pattern</h3>
                <FormInput control={control} name="pattern" />
              </div>
              <div className="space-y-6">
                <h3>Trim</h3>
                <FormSelect control={control} name="trim">
                  {TRIM_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </FormSelect>
              </div>
              <div className="space-y-6">
                <h3>Encode</h3>
                <FormSelect control={control} name="encode">
                  {DEFINE_PACKET_ENCODE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </FormSelect>
              </div>
            </>
          )}
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
