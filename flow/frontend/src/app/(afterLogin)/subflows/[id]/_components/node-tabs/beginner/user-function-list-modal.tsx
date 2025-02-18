'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { FuncList } from '@/models/property/flow'
import { useQueryDefines } from '@/services/define'
import { useModalStore } from '@/store/modal'
import { removeDuplicateDefines } from '@/utils/options'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../../node-properties/types'

const schema = Yup.object().shape({
  name: Yup.string().required('Function Name을 입력해주세요'),
  condition: Yup.string().required('Condition을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: FuncList
  rowIndex?: number
}

export default function BeginnerUserFunctionListModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (
    mode: 'create' | 'update',
    data: FuncList,
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
  } = useForm<FuncList>({
    defaultValues: modalData?.data || {
      name: '',
      condition: '1',
    },
    resolver: yupResolver(schema),
  })

  const { data: userfuncs } = useSuspenseQuery({
    ...useQueryDefines<FuncList>('userfunc'),
    select: (data) => removeDuplicateDefines(data),
  })

  const onSubmitForm = (data: FuncList) => {
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
            <h3>Function Name</h3>
            <FormAutocomplete
              control={control}
              name="name"
              options={options}
              selectOptions={userfuncs.map((userfunc) => userfunc.defineId)}
              autoFocus
              onValueChange={onValueChange}
            />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Condition</h3>
            <FormAutocomplete
              control={control}
              name="condition"
              options={options}
              onValueChange={onValueChange}
            />
            {errors.condition && (
              <span className="error-msg">{errors.condition.message}</span>
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
