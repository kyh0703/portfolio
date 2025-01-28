'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormSelect from '@/app/_components/form-select'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { SelectItem } from '@/app/_components/select'
import {
  ERROR_DEFINE_VARIABLE_NAME_MESSAGE,
  ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
} from '@/constants/error-message'
import { CDR_TYPE_OPTIONS, type CdrType } from '@/constants/options'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { CdrDataList } from '@/models/property/flow'
import { useQueryCdrKeys } from '@/services/cdr'
import { useQueryDefines } from '@/services/define'
import { useModalStore } from '@/store/modal'
import { validateVarDefine, validateVarExpression } from '@/utils'
import { removeDuplicateDefines } from '@/utils/options'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../node-property/types'

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Name을 입력해주세요')
    .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
  type: Yup.mixed<CdrType>().required('Type을 입력해주세요'),
  expression: Yup.string()
    .required('Expression을 입력해주세요')
    .when('type', {
      is: (type: CdrType) => type === 'Select',
      then: (schema) =>
        schema.test(
          'define',
          ERROR_DEFINE_VARIABLE_NAME_MESSAGE,
          validateVarDefine,
        ),
      otherwise: (schema) =>
        schema.test(
          'expression',
          ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
          validateVarExpression,
        ),
    }),
  condition: Yup.string().required('Condition을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: CdrDataList
}

export default function CdrModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (mode: 'create' | 'update', data: CdrDataList) => void
}) {
  const id = useModalId()
  const [options, _, onValueChange] = useAutocomplete({ ...tabProps })
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CdrDataList>({
    defaultValues: modalData?.data || {
      name: '',
      type: 'Append',
      expression: '',
      condition: '1',
    },
    resolver: yupResolver(schema),
  })

  const type = watch('type')

  const { variables, cdrKeys } = useSuspenseQueries({
    queries: [useQueryDefines('var'), useQueryCdrKeys(type)],
    combine: (results) => ({
      variables: removeDuplicateDefines(results[0].data),
      cdrKeys: results[1].data,
    }),
  })

  const onSubmitForm = (data: CdrDataList) => {
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
            <h3>Name(CDR Key)</h3>
            <FormAutocomplete
              control={control}
              name="name"
              selectOptions={cdrKeys?.map((key) => ({
                label: key.name + (key.desc && `- ${key.desc}`),
                value: key.name,
              }))}
              autoFocus
            />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Type</h3>
            <FormSelect
              control={control}
              name="type"
              onValueChange={(value) => {
                setValue('type', value as CdrType)
                setValue('name', '')
              }}
            >
              {CDR_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </FormSelect>
            {errors.type && (
              <span className="error-msg">{errors.type.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Value(Expression)</h3>
            <FormAutocomplete
              control={control}
              name="expression"
              options={options}
              selectOptions={variables.map((variable) => variable.defineId)}
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
