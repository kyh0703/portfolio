'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormInput from '@/app/_components/form-input'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { GramList } from '@/models/property/common'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../../node-properties/types'

const schema = Yup.object().shape({
  grammar: Yup.string().required('grammar을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: GramList
  rowIndex?: number
}

export default function BeginnerRecognizeInfoModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (
    mode: 'create' | 'update',
    data: GramList,
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
  } = useForm<GramList>({
    defaultValues: modalData?.data || {
      grammar: '',
      desc: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: GramList) => {
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
            <h3>Grammar</h3>
            <FormAutocomplete
              control={control}
              name="grammar"
              options={options}
              autoFocus
              onValueChange={onValueChange}
            />
            {errors.grammar && (
              <span className="error-msg">{errors.grammar.message}</span>
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
