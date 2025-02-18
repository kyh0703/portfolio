'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormTextarea from '@/app/_components/form-textarea'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import {
  ERROR_DEFINE_VARIABLE_NAME_MESSAGE,
  ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
} from '@/constants/error-message'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { InParams } from '@/models/property/common'
import { useModalStore } from '@/store/modal'
import { validateVarDefine, validateVarExpression } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../../node-properties/types'

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Name을 입력해주세요')
    .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
  value: Yup.string().test(
    'expression',
    ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
    validateVarExpression,
  ),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: InParams
  rowIndex?: number
}

export default function ParameterInfoModal({
  tabProps,
  type,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  type: 'in' | 'out'
  onSubmit?: (
    mode: 'create' | 'update',
    data: InParams,
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
  } = useForm<InParams>({
    defaultValues: modalData?.data || {
      name: '',
      value: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: InParams) => {
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
            <h3>Parameter Name</h3>
            <FormAutocomplete
              control={control}
              name="name"
              options={options}
              autoFocus
              onValueChange={onValueChange}
            />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          {type === 'in' && (
            <div className="space-y-3">
              <h3>Expression</h3>
              <FormTextarea control={control} name="value" />
              {errors.value && (
                <span className="error-msg">{errors.value.message}</span>
              )}
            </div>
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
