'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { ERROR_VARIABLE_NAME_MESSAGE } from '@/constants/error-message'
import { REG_EX_VARIABLE_NAME } from '@/constants/regex'
import { useModalId } from '@/contexts/modal-context'
import { FlowTreeData } from '@/models/subflow-list'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('Name을 입력해주세요.')
    .matches(REG_EX_VARIABLE_NAME, ERROR_VARIABLE_NAME_MESSAGE),
  desc: Yup.string().optional(),
})

type ModalData = {
  data: FlowTreeData
}

export default function SubFlowPropertiesModal({
  onSubmit,
}: {
  onSubmit?: (origin: FlowTreeData, replace: FlowTreeData) => void
}) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string; desc?: string }>({
    defaultValues: modalData?.data || {
      name: '',
      desc: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: { name: string; desc?: string }) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData?.data, { ...modalData.data, ...data })
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
            <h3>Name</h3>
            <FormInput control={control} name="name" />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Desc</h3>
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
