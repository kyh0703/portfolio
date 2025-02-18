'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { SELECT_CONDITION_OPTIONS } from '@/constants/options'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { Link } from '@/models/property/flow'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../../node-properties/types'

const schema = Yup.object().shape({
  start: Yup.string().required('Start Condition을 입력해주세요'),
})

type Condition = {
  start: string
  end?: string
}

type ModalData = {
  mode: 'create' | 'update'
  data?: Link
}

export default function ConditionAndLinkModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (mode: 'create' | 'update', data: Link) => void
}) {
  const id = useModalId()
  const [options, _, onValueChange] = useAutocomplete({ ...tabProps })
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Condition>({
    defaultValues: {
      start: modalData?.data?.condition.split(' .. ')[0] ?? '',
      end: modalData?.data?.condition.split(' .. ')[1] ?? '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: Condition) => {
    closeModal(id)
    reset()
    const condition = data.end ? `${data.start} .. ${data.end}` : data.start
    onSubmit &&
      onSubmit(modalData.mode, {
        target: modalData?.data?.target ?? '',
        condition,
      })
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
            <h3>Start Condition</h3>
            <FormAutocomplete
              control={control}
              name="start"
              options={options}
              selectOptions={SELECT_CONDITION_OPTIONS}
              autoFocus
              onValueChange={onValueChange}
            />
            {errors.start && (
              <span className="error-msg">{errors.start.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>End Condition</h3>
            <FormAutocomplete
              control={control}
              name="end"
              options={options}
              selectOptions={SELECT_CONDITION_OPTIONS}
              autoFocus
              onValueChange={onValueChange}
            />
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
