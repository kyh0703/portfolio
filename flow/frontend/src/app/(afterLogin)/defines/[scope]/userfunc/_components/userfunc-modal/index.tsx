'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import FormSelect from '@/app/_components/form-select'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { SelectItem } from '@/app/_components/select'
import { ERROR_VARIABLE_NAME_MESSAGE } from '@/constants/error-message'
import { USER_FUNC_TYPE_OPTIONS } from '@/constants/options'
import { REG_EX_VARIABLE_NAME } from '@/constants/regex'
import { useModalId } from '@/contexts/modal-context'
import type { DefineUserFunc } from '@/models/define'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Name을 입력해주세요')
    .matches(REG_EX_VARIABLE_NAME, ERROR_VARIABLE_NAME_MESSAGE),
  file: Yup.string().required('File을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: { id?: number; property: DefineUserFunc }
}

export default function UserfuncModal({
  onSubmit,
}: {
  onSubmit?: (
    mode: 'create' | 'update',
    data: { id?: number; property: DefineUserFunc },
  ) => void
}) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<DefineUserFunc>({
    defaultValues: modalData?.data?.property || {
      name: '',
      file: '',
      type: '',
      desc: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: DefineUserFunc) => {
    closeModal(id)
    reset()
    onSubmit &&
      onSubmit(modalData.mode, { id: modalData.data?.id, property: data })
  }

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <ModalContent>
        <div className="gap-3 space-y-3">
          <div className="space-y-6">
            <h3>Function Name</h3>
            <FormInput control={control} name="name" autoFocus />
            {errors?.name && (
              <span className="text-nowrap text-center text-xs text-error">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="space-y-6">
            <h3>Library File</h3>
            <FormInput control={control} name="file" />
            {errors?.file && (
              <span className="text-nowrap text-center text-xs text-error">
                {errors.file.message}
              </span>
            )}
          </div>
          <div className="space-y-6">
            <h3>Library Type</h3>
            <FormSelect control={control} name="type">
              {USER_FUNC_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </FormSelect>
          </div>
          <div className="space-y-6">
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
