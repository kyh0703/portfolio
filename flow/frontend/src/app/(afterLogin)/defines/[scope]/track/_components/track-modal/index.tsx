'use client'

import { nodeTypes } from '@/app/(afterLogin)/subflows/[id]/_components/flow-main/node'
import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import FormSelect from '@/app/_components/form-select'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { SelectItem } from '@/app/_components/select'
import { ERROR_VARIABLE_NAME_MESSAGE } from '@/constants/error-message'
import { REG_EX_VARIABLE_NAME } from '@/constants/regex'
import { useModalId } from '@/contexts/modal-context'
import type { DefineTracking } from '@/models/define'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const schema = Yup.object().shape({
  id: Yup.string()
    .required('ID를 입력해주세요')
    .matches(REG_EX_VARIABLE_NAME, ERROR_VARIABLE_NAME_MESSAGE),
  name: Yup.string().required('Name을 입력해주세요'),
  type: Yup.string().optional(),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: { id?: number; property: DefineTracking }
}

export default function TrackModal({
  onSubmit,
}: {
  onSubmit?: (
    mode: 'create' | 'update',
    data: { id?: number; property: DefineTracking },
  ) => void
}) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const nodeTypeOptions = useMemo(() => {
    return [
      '\u00A0',
      ...Object.keys(nodeTypes).filter(
        (type) => type !== 'Group' && type !== 'Memo' && type !== 'Ghost',
      ),
    ].map((option) => ({ option }))
  }, [])

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<DefineTracking>({
    defaultValues: modalData?.data?.property || {
      id: '',
      name: '',
      type: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: DefineTracking) => {
    closeModal(id)
    reset()
    onSubmit &&
      onSubmit(modalData.mode, { id: modalData.data?.id, property: data })
  }

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <ModalContent>
        <div className="gap-3 space-y-3">
          <div className="space-y-6">
            <h3>ID</h3>
            <FormInput control={control} name="id" autoFocus />
            {errors.id && (
              <span className="error-msg">{errors.id.message}</span>
            )}
          </div>
          <div className="space-y-6">
            <h3>Name</h3>
            <FormInput control={control} name="name" />
            {errors?.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-6">
            <h3>Type</h3>
            <FormSelect control={control} name="type">
              {nodeTypeOptions.map(({ option }) => (
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
