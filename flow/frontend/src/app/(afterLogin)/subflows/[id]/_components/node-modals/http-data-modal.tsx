'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { HeaderList } from '@/models/property/packet'
import { useQueryVariables } from '@/services/variable/queries/use-query-variables'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../node-property/types'

const schema = Yup.object().shape({
  name: Yup.string().required('Name을 입력해주세요'),
  value: Yup.string().required('Expression을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  type: 'head' | 'body'
  data?: HeaderList
}

export default function HttpDataModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (
    mode: 'create' | 'update',
    type: 'head' | 'body',
    data: HeaderList,
  ) => void
}) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )
  const [options, _, onValueChange] = useAutocomplete({ ...tabProps })

  const { data: variableOptions } = useSuspenseQuery(
    useQueryVariables(tabProps.subFlowId),
  )
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<HeaderList>({
    defaultValues: modalData?.data,
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: HeaderList) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData.mode, modalData.type, data)
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
            <h3>Node Name</h3>
            <FormAutocomplete
              control={control}
              name="name"
              selectOptions={variableOptions}
              options={options}
              autoFocus
              onValueChange={onValueChange}
            />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Tag Name</h3>
            <FormAutocomplete
              control={control}
              name="value"
              rows={10}
              options={options}
              onValueChange={onValueChange}
            />
            {errors.value && (
              <span className="error-msg">{errors.value.message}</span>
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
