'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import {
  ERROR_DEFINE_VARIABLE_NAME_MESSAGE,
  ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
} from '@/constants/error-message'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { CodeData } from '@/models/property/common'
import { useQueryVariables } from '@/services/variable/queries/use-query-variables'
import { useModalStore } from '@/store/modal'
import { validateVarDefine, validateVarExpression } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../node-property/types'

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Name을 입력해주세요')
    .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
  expression: Yup.string().test(
    'expression',
    ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
    validateVarExpression,
  ),
  condition: Yup.string().required('Condition을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: CodeData
}

export default function ChatInfoModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (mode: 'create' | 'update', data: CodeData) => void
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
  } = useForm<CodeData>({
    defaultValues: modalData?.data || {
      name: '',
      expression: '',
      condition: '1',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: CodeData) => {
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
        <div className="space-y-6">
          <div className="space-y-3">
            <h3>Variable Name</h3>
            <FormAutocomplete
              control={control}
              name="name"
              options={options}
              selectOptions={variableOptions}
              autoFocus
              onValueChange={onValueChange}
            />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Expression</h3>
            <FormAutocomplete
              control={control}
              name="expression"
              rows={10}
              options={options}
              onValueChange={onValueChange}
            />
            {errors.expression && (
              <span className="error-msg">{errors.expression.message}</span>
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
