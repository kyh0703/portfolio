'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormInput from '@/app/_components/form-input'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { SELECT_CONDITION_OPTIONS } from '@/constants/options'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { MenuData } from '@/models/property/flow'
import { useQueryMenus } from '@/services/menu'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../node-property/types'

const schema = Yup.object().shape({
  dtmf: Yup.string().required('DTMF를 입력해주세요'),
  menuId: Yup.string().required('Menu ID를 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: MenuData
}

export default function SetMenuModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (mode: 'create' | 'update', data: MenuData) => void
}) {
  const id = useModalId()
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )
  const [options, _, onValueChange] = useAutocomplete({ ...tabProps })

  const { data: menuList } = useSuspenseQuery(useQueryMenus())

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<MenuData>({
    defaultValues: modalData?.data || {
      dtmf: '',
      vrValue: '',
      menuId: '',
      desc: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: MenuData) => {
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
            <h3>DTMF</h3>
            <FormAutocomplete
              control={control}
              name="dtmf"
              options={options}
              selectOptions={SELECT_CONDITION_OPTIONS}
              autoFocus
              onValueChange={onValueChange}
            />
            {errors.dtmf && (
              <span className="error-msg">{errors.dtmf.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>VR Value</h3>
            <FormAutocomplete
              control={control}
              name="vrValue"
              options={options}
              onValueChange={onValueChange}
            />
          </div>
          <div className="space-y-3">
            <h3>Menu ID</h3>
            <FormAutocomplete
              control={control}
              name="menuId"
              options={options}
              selectOptions={menuList.map((ment) => ment.property.id)}
              onValueChange={onValueChange}
            />
            {errors.menuId && (
              <span className="error-msg">{errors.menuId.message}</span>
            )}
          </div>
          <div className="space-y-3">
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
