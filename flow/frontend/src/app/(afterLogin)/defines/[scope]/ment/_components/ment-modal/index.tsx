'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import FormTextarea from '@/app/_components/form-textarea'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { ERROR_VARIABLE_NAME_MESSAGE } from '@/constants/error-message'
import { REG_EX_VARIABLE_NAME } from '@/constants/regex'
import { useModalId } from '@/contexts/modal-context'
import type { DefineMent } from '@/models/define'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const schema = Yup.object().shape({
  id: Yup.string()
    .required('ID를 입력해주세요')
    .matches(REG_EX_VARIABLE_NAME, ERROR_VARIABLE_NAME_MESSAGE),
  file: Yup.string().required('File을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: { id?: number; property: DefineMent }
}

export default function MentModal({
  onSubmit,
}: {
  onSubmit?: (
    mode: 'create' | 'update',
    data: { id?: number; property: DefineMent },
  ) => void
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
  } = useForm<DefineMent>({
    defaultValues: modalData?.data?.property || {
      id: '',
      file: '',
      desc: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (define: DefineMent) => {
    closeModal(id)
    reset()
    onSubmit &&
      onSubmit(modalData.mode, { id: modalData.data?.id, property: define })
  }

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <ModalContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3>ID</h3>
            <FormInput control={control} name="id" autoFocus />
            {errors.id && (
              <span className="error-msg">{errors.id.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>File</h3>
            <FormInput control={control} name="file" />
            {errors.file && (
              <span className="error-msg">{errors.file.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Description</h3>
            <FormTextarea
              className="w-full"
              control={control}
              name="desc"
              rows={10}
            />
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
