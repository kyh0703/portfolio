'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import FormSelect from '@/app/_components/form-select'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { SelectItem } from '@/app/_components/select'
import { useModalId } from '@/contexts/modal-context'
import { DefineIntent } from '@/models/define'
import { IntentList } from '@/models/property/ai'
import { useQueryDefines } from '@/services/define'
import { useModalStore } from '@/store/modal'
import { removeDuplicateDefines } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../../node-properties/types'

const schema = Yup.object().shape({
  id: Yup.string().required('Name을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: IntentList
  rowIndex?: number
}

export default function BeginnerIntentInfoModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (
    mode: 'create' | 'update',
    data: IntentList,
    rowIndex?: number,
  ) => void
}) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const { data: defineIntentList } = useSuspenseQuery({
    ...useQueryDefines<DefineIntent>('intent'),
    select: (data) => removeDuplicateDefines(data),
  })
  const {
    watch,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<IntentList>({
    defaultValues: modalData?.data || {
      id: '',
      name: '',
      menuCall: '',
      subCall: '',
    },
    resolver: yupResolver(schema),
  })
  const watchIntentId = watch('id')

  useEffect(() => {
    if (watchIntentId) {
      const intent = defineIntentList.find(
        (intent) => intent.defineId === watchIntentId,
      )
      if (intent) {
        setValue('name', intent.property.name)
        setValue('menuCall', intent.property.menuCall)
        setValue('subCall', intent.property.subCall)
      }
    }
  }, [defineIntentList, setValue, watchIntentId])

  const onSubmitForm = (data: IntentList) => {
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
            <h3>Intent ID</h3>
            <FormSelect control={control} name="id">
              {defineIntentList.map(({ defineId }) => (
                <SelectItem key={defineId} value={defineId}>
                  {defineId}
                </SelectItem>
              ))}
            </FormSelect>
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Intent Name</h3>
            <FormInput
              control={control}
              name="name"
              readOnly={true}
              onChange={() => {}}
            />
          </div>
          <div className="space-y-3">
            <h3>Action MenuCall</h3>
            <FormInput
              control={control}
              name="menuCall"
              readOnly={true}
              onChange={() => {}}
            />
          </div>
          <div className="space-y-3">
            <h3>Action SubCall</h3>
            <FormInput
              control={control}
              name="subCall"
              readOnly={true}
              onChange={() => {}}
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
