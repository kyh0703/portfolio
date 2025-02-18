'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormSelect from '@/app/_components/form-select'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { SelectItem } from '@/app/_components/select'
import { BSR_ROUTING_OPTIONS, SKILL_LEVEL_OPTIONS } from '@/constants/options'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { RouteGroupList } from '@/models/property/common'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../../node-properties/types'

const schema = Yup.object().shape({
  groupId: Yup.string().required('Group ID을 입력해주세요'),
  priority: Yup.string().required('Route Priority를 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data: RouteGroupList
  rowIndex?: number
}

export default function RouteGroupInfoModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (
    mode: 'create' | 'update',
    data: RouteGroupList,
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
  } = useForm<RouteGroupList>({
    defaultValues: modalData?.data || {
      groupId: 'session.call.groupid',
      routeType: 'session.call.routetype',
      bsrRoute: '적용',
      priority: 'session.call.priority',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: RouteGroupList) => {
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
            <h3>Group ID</h3>
            <FormAutocomplete
              control={control}
              name="groupId"
              options={options}
              autoFocus
              onValueChange={onValueChange}
            />
            {errors.groupId && (
              <span className="error-msg">{errors.groupId.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Route Type</h3>
            <FormSelect control={control} name="routeType">
              {SKILL_LEVEL_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </FormSelect>
          </div>
          <div className="space-y-3">
            <h3>BSR Routing</h3>
            <FormSelect control={control} name="bsrRoute">
              {BSR_ROUTING_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </FormSelect>
          </div>
          <div className="space-y-3">
            <h3>Route Priority</h3>
            <FormAutocomplete
              control={control}
              name="priority"
              options={options}
              onValueChange={onValueChange}
            />
            {errors.priority && (
              <span className="error-msg">{errors.priority.message}</span>
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
