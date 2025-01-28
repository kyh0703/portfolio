'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { ERROR_VARIABLE_NAME_MESSAGE } from '@/constants/error-message'
import { REG_EX_VARIABLE_NAME } from '@/constants/regex'
import { useModalId } from '@/contexts/modal-context'
import type { DefineService } from '@/models/define/service'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const schema = Yup.object().shape({
  code: Yup.string()
    .required('Code를 입력해주세요')
    .matches(REG_EX_VARIABLE_NAME, ERROR_VARIABLE_NAME_MESSAGE),
  name: Yup.string().required('Name을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: { id?: number; property: DefineService }
}

type ServiceModalProps = {
  onSubmit?: (
    mode: 'create' | 'update',
    data: { id?: number; property: DefineService },
  ) => void
}

export default function ServiceModal({ onSubmit }: ServiceModalProps) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<DefineService>({
    defaultValues: modalData?.data?.property || {
      code: '',
      name: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (define: DefineService) => {
    reset()
    closeModal(id)
    onSubmit &&
      onSubmit(modalData.mode, { id: modalData.data?.id, property: define })
  }

  const handleCancelClick = () => {
    reset()
    closeModal(id)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <ModalContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3>Code</h3>
            <FormInput control={control} name="code" autoFocus />
            {errors.code && (
              <span className="error-msg">{errors.code.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Name</h3>
            <FormInput control={control} name="name" />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
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
