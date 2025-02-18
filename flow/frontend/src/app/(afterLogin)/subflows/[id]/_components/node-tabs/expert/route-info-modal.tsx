'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormSelect from '@/app/_components/form-select'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { SelectItem } from '@/app/_components/select'
import { BSR_ROUTING_OPTIONS, SKILL_LEVEL_OPTIONS } from '@/constants/options'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { RouteList } from '@/models/property/common'
import { useModalStore } from '@/store/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../../node-properties/types'

const schema = Yup.object().shape({
  skillId: Yup.string().required('Skill ID을 입력해주세요'),
  skillLevel: Yup.string().required('Skill Level을 입력해주세요'),
  routeType: Yup.string().required('Route Type을 입력해주세요'),
  bsrRoute: Yup.string().required('BSR Route을 입력해주세요'),
  priority: Yup.string().required('Route Priority를 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data: RouteList
  rowIndex?: number
}

export default function RouteInfoModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (
    mode: 'create' | 'update',
    data: RouteList,
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
  } = useForm<RouteList>({
    defaultValues: modalData?.data || {
      skillId: 'session.call.skillid',
      skillLevel: 'session.call.skilllvl',
      routeType: 'session.call.routetype',
      bsrRoute: '적용',
      priority: 'session.call.priority',
    },
    resolver: yupResolver(schema),
  })

  const onSubmitForm = (data: RouteList) => {
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
            <h3>Skill ID</h3>
            <FormAutocomplete
              control={control}
              name="skillId"
              options={options}
              autoFocus
              onValueChange={onValueChange}
            />
            {errors.skillId && (
              <span className="error-msg">{errors.skillId.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Skill Level</h3>
            <FormAutocomplete
              control={control}
              name="skillLevel"
              options={options}
              onValueChange={onValueChange}
            />
            {errors.skillLevel && (
              <span className="error-msg">{errors.skillLevel.message}</span>
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
            {errors.routeType && (
              <span className="error-msg">{errors.routeType.message}</span>
            )}
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
            {errors.bsrRoute && (
              <span className="error-msg">{errors.bsrRoute.message}</span>
            )}
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
