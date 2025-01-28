'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { useModalId } from '@/contexts/modal-context'
import { useQueryCdrKeys } from '@/services/cdr'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { FormEventHandler } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const schema = Yup.object().shape({
  name: Yup.string().required('Name을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data: { name: string }
}

export default function CdrModal({
  onSubmit,
}: {
  onSubmit?: (mode: 'create' | 'update', data: string) => void
}) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const { data: selectOptions } = useSuspenseQuery(useQueryCdrKeys('Update'))

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues: modalData?.data || {
      name: '',
    },
    resolver: yupResolver(schema),
  })

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  const onSubmitForm = (data: { name: string }) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData.mode, data.name)
  }

  const handleModalSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.stopPropagation()
    handleSubmit(onSubmitForm)(event)
  }

  return (
    <form onSubmit={handleModalSubmit}>
      <ModalContent>
        <div className="space-y-3">
          <h3>Name</h3>
          <FormAutocomplete
            control={control}
            name="name"
            selectOptions={selectOptions.map((option) => option.name)}
            autoFocus
          />
          {errors.name && (
            <span className="error-msg">{errors.name.message}</span>
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
