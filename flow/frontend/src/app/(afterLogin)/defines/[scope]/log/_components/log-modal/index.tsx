'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormCheckbox from '@/app/_components/form-checkbox'
import FormInput from '@/app/_components/form-input'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { ERROR_VARIABLE_NAME_MESSAGE } from '@/constants/error-message'
import { DEFINE_LOG_PERIOD_OPTIONS } from '@/constants/options'
import { REG_EX_VARIABLE_NAME } from '@/constants/regex'
import { useModalId } from '@/contexts/modal-context'
import type { DefineLog } from '@/models/define'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const schema = Yup.object().shape({
  id: Yup.string()
    .required('Name을 입력해주세요')
    .matches(REG_EX_VARIABLE_NAME, ERROR_VARIABLE_NAME_MESSAGE),
  path: Yup.string().required('Path를 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: { id?: number; property: DefineLog }
}

type LogModalProps = {
  onSubmit?: (
    mode: 'create' | 'update',
    data: { id?: number; property: DefineLog },
  ) => void
}

export default function LogModal({ onSubmit }: LogModalProps) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<DefineLog>({
    defaultValues: modalData?.data?.property || {
      id: '',
      path: '',
      extension: '',
      period: '',
      timeStamp: false,
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (define: DefineLog) => {
    reset()
    closeModal(id)
    onSubmit &&
      onSubmit(modalData.mode, { id: modalData.data?.id, property: define })
  }

  const handleCancelClick = () => {
    reset()
    closeModal(id)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <ModalContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3>Name</h3>
            <FormInput control={control} name="id" autoFocus />
            {errors.id && (
              <span className="error-msg">{errors.id.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Path</h3>
            <FormInput control={control} name="path" />
            {errors.path && (
              <span className="error-msg">{errors.path.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Extension</h3>
            <FormInput control={control} name="extension" />
          </div>
          <div className="space-y-3">
            <h3>Period</h3>
            <FormAutocomplete
              control={control}
              name="period"
              selectOptions={DEFINE_LOG_PERIOD_OPTIONS}
            />
          </div>
          <div className="space-y-3">
            <FormCheckbox
              control={control}
              name="timeStamp"
              label="Time Stamp"
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
