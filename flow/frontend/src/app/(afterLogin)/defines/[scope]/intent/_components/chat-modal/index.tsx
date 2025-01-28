'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormInput from '@/app/_components/form-input'
import FormTextarea from '@/app/_components/form-textarea'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { useModalId } from '@/contexts/modal-context'
import type { CodeData } from '@/models/define/common'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import type { FormEventHandler } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const schema = Yup.object().shape({
  name: Yup.string().required('Name을 입력해주세요'),
  expression: Yup.string().required('Expression을 입력해주세요'),
  condition: Yup.string().required('Condition을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: CodeData
}

export default function ChatModal({
  onSubmit,
}: {
  onSubmit?: (mode: 'create' | 'update', data: CodeData) => void
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
  } = useForm<CodeData>({
    defaultValues: modalData?.data || {
      name: '',
      expression: '',
      condition: '1',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: CodeData) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData.mode, data)
  }

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  const handleModalSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.stopPropagation()
    handleSubmit(onSubmitForm)(event)
  }

  return (
    <form onSubmit={handleModalSubmit}>
      <ModalContent>
        <div className="space-y-6 px-6">
          <div className="space-y-3">
            <h3>Variable Name</h3>
            <FormAutocomplete
              control={control}
              name="name"
              // TODO: ChatModal - FormAutocomplete - selectOptions
              selectOptions={[]}
              autoFocus
            />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Expression</h3>
            <FormTextarea
              control={control}
              name="expression"
              className="w-full"
              rows={10}
            />
            {errors.expression && (
              <span className="error-msg">{errors.expression.message}</span>
            )}
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
