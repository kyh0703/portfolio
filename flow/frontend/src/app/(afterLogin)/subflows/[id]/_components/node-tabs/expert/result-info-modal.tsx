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
import type { NodePropertyTabProps } from '../../node-properties/types'

export interface VariableType {
  variable: string
}

const schema = Yup.object().shape({
  variable: Yup.string().required('Variable을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data: string
  rowIndex?: number
}

export default function ResultInfoModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (payload: ModalData, rowIndex?: number) => void
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
  } = useForm<VariableType>({
    defaultValues: {
      variable: modalData?.data || '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: VariableType) => {
    closeModal(id)
    reset()
    onSubmit &&
      onSubmit({
        mode: modalData.mode,
        data: data.variable,
        rowIndex: modalData.rowIndex,
      })
  }

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <ModalContent>
        <div className="space-y-3">
          <h3>Variable</h3>
          <FormAutocomplete
            control={control}
            name="variable"
            options={options}
            autoFocus
            onValueChange={onValueChange}
          />
          {errors.variable && (
            <span className="error-msg">{errors.variable.message}</span>
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
