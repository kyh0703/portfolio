'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { ParamList } from '@/models/property/iweb'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../../node-properties/types'

const schema = Yup.object().shape({
  objectId: Yup.string().required('ObjectId를 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: ParamList
  rowIndex?: number
}

export default function BeginnerHtmlInfoModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (
    mode: 'create' | 'update',
    data: ParamList,
    rowIndex?: number,
  ) => void
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
  } = useForm<ParamList>({
    defaultValues: modalData?.data || {
      objectId: '',
      value: '',
      type: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: ParamList) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData.mode, data, modalData.rowIndex)
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
          <div className="space-y-3">
            <h3>Value</h3>
            <FormAutocomplete
              control={control}
              name="value"
              options={options}
              onValueChange={onValueChange}
            />
            {errors.value && (
              <span className="error-msg">{errors.value.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Type</h3>
            <FormAutocomplete
              control={control}
              name="type"
              options={options}
              onValueChange={onValueChange}
            />
            {errors.type && (
              <span className="error-msg">{errors.type.message}</span>
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
