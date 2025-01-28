'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../node-property/types'

const schema = Yup.object().shape({
  objectId: Yup.string().required('ObjectId를 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: string
}

export default function HtmlInputModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (mode: 'create' | 'update', data: string) => void
}) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )
  const [options, _, onValueChange] = useAutocomplete({ ...tabProps })

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<{ objectId: string }>({
    defaultValues: {
      objectId: modalData?.data || '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: { objectId: string }) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData.mode, data.objectId)
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
            <h3>Argument Data</h3>
            <FormAutocomplete
              control={control}
              name="objectId"
              options={options}
              autoFocus
              onValueChange={onValueChange}
            />
            {errors.objectId && (
              <span className="error-msg">{errors.objectId.message}</span>
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
