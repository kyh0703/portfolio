'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import {
  ERROR_DEFINE_VARIABLE_NAME_MESSAGE,
  ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
} from '@/constants/error-message'
import { useModalId } from '@/contexts/modal-context'
import type { DefineVar } from '@/models/define'
import { useModalStore } from '@/store/modal'
import { validateVar, validateVarExpression } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Type을 입력해주세요')
    .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVar),
  value: Yup.string()
    .required('Name을 입력해주세요')
    .test(
      'expression',
      ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
      validateVarExpression,
    ),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: { id?: number; property: DefineVar }
}

type VarModalProps = {
  onSubmit?: (
    mode: 'create' | 'update',
    data: { id?: number; property: DefineVar },
  ) => void
}

export default function VarModal({ onSubmit }: VarModalProps) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<DefineVar>({
    defaultValues: modalData?.data?.property || {
      name: '',
      value: '',
      desc: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (define: DefineVar) => {
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
            <h3>Name</h3>
            <FormInput control={control} name="name" autoFocus />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Value</h3>
            <FormInput control={control} name="value" />
            {errors.value && (
              <span className="error-msg">{errors.value.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Description</h3>
            <FormInput control={control} name="desc" />
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
