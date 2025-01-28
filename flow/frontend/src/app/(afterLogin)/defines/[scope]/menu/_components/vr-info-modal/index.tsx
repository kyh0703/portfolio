'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { useModalId } from '@/contexts/modal-context'
import type { GramList } from '@/models/define'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const schema = Yup.object().shape({
  gram: Yup.string().required('grammar을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: GramList
}

export default function VRInfoModal({
  onSubmit,
}: {
  onSubmit?: (mode: 'create' | 'update', data: GramList) => void
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
  } = useForm<GramList>({
    defaultValues: modalData?.data || {
      gram: '',
      desc: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: GramList) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData.mode, data)
  }

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <ModalContent>
        <div className="space-y-6 p-6">
          <div className="space-y-3">
            <h3>Grammar</h3>
            <FormInput control={control} name="gram" autoFocus />
            {errors.gram && (
              <span className="error-msg">{errors.gram.message}</span>
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
