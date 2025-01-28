'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import {
  ERROR_VARIABLE_NAME_MESSAGE,
  ERROR_VERSION_MESSAGE,
} from '@/constants/error-message'
import { REG_EX_VARIABLE_NAME, REG_EX_VERSION } from '@/constants/regex'
import { useModalId } from '@/contexts/modal-context'
import { SubFlowList } from '@/models/subflow-list'
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
  version: Yup.string()
    .required('Version을 입력해주세요.')
    .matches(REG_EX_VERSION, ERROR_VERSION_MESSAGE),
  desc: Yup.string().optional(),
})

type FormData = { name: string; version: string; desc?: string }
type ModalData = {
  mode: 'create' | 'update'
  data: SubFlowList
}

export default function CommonFlowModal({
  onSubmit,
}: {
  onSubmit?: (
    mode: 'create' | 'update' | 'deplicate',
    data: SubFlowList,
  ) => void
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
  } = useForm<FormData>({
    defaultValues: modalData?.data || {
      name: '',
      version: '',
      desc: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: FormData) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData.mode, { ...modalData.data, ...data })
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
            <FormInput
              control={control}
              name="name"
              placeholder="내용을 입력하세요."
              autoFocus
            />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Version</h3>
            <FormInput
              control={control}
              name="version"
              placeholder="내용을 입력하세요."
            />
            {errors.version && (
              <span className="error-msg">{errors.version.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Description</h3>
            <FormInput
              control={control}
              name="desc"
              placeholder="내용을 입력하세요."
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
