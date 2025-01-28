'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { useQueryVariables } from '@/services/variable/queries/use-query-variables'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../node-property/types'
import { ERROR_DEFINE_VARIABLE_NAME_MESSAGE } from '@/constants/error-message'
import { validateVarDefine } from '@/utils'

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Name을 입력해주세요')
    .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
})

type ModalData = {
  mode: 'create' | 'update'
  type: 'in' | 'out'
  data: string
}

export default function ResultInfoModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (payload: ModalData) => void
}) {
  const id = useModalId()
  const [options, _, onValueChange] = useAutocomplete({ ...tabProps })
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const { data: variableOptions } = useSuspenseQuery(
    useQueryVariables(tabProps.subFlowId),
  )

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues: {
      name: modalData?.data || '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = ({ name }: { name: string }) => {
    closeModal(id)
    reset()
    onSubmit &&
      onSubmit({ mode: modalData.mode, type: modalData.type, data: name })
  }

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <ModalContent>
        <div className="space-y-3">
          <h3>Argument Data</h3>
          <FormAutocomplete
            name="name"
            control={control}
            options={options}
            selectOptions={variableOptions}
            autoFocus
            onValueChange={onValueChange}
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
