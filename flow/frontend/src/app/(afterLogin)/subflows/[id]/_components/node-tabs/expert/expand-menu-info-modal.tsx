'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormCheckbox from '@/app/_components/form-checkbox'
import FormRadioGroup from '@/app/_components/form-radio-group'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { RadioGroupItem } from '@/app/_components/radio-group'
import { SELECT_CONDITION_OPTIONS } from '@/constants/options'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { BranchList } from '@/models/property/flow'
import { getInFlows } from '@/services/flow'
import { getMenu, useQueryMenus } from '@/services/menu'
import { useModalStore } from '@/store/modal'
import { removeDuplicateMenus } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../../node-properties/types'

const schema = Yup.object().shape({
  comCondition: Yup.string().when('branchType', {
    is: (inputType: 'Default' | 'Condition') => inputType === 'Condition',
    then: (schema) => schema.required('Compare Condition을 입력해주세요'),
  }),
  name: Yup.string().required('Name을 입력해주세요'),
  menuId: Yup.string().required('Menu ID를 입력해주세요'),
  condition: Yup.string().required('Condition을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: BranchList
  rowIndex?: number
}

export default function ExpandMenuInfoModal({
  tabProps,
  disable,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  disable: boolean
  onSubmit?: (
    mode: 'create' | 'update',
    data: BranchList,
    rowIndex?: number,
  ) => void
}) {
  const id = useModalId()
  const router = useRouter()
  const [options, _, onValueChange] = useAutocomplete({ ...tabProps })
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const {
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<BranchList>({
    defaultValues: modalData?.data || {
      branchType: 'Condition',
      comCondition: '',
      name: '',
      useExpression: false,
      menuId: '',
      condition: '1',
    },
    resolver: yupResolver(schema),
  })

  const { data: menus } = useSuspenseQuery({
    ...useQueryMenus(),
    select: (data) => removeDuplicateMenus(data),
  })
  const [watchBranchType, watchMenuId] = watch(['branchType', 'menuId'])

  const menuName = useMemo(() => {
    const menu = menus.find((menu) => menu.property.id === watchMenuId)
    return menu ? menu.property.name : ''
  }, [menus, watchMenuId])

  const onSubmitForm = (data: BranchList) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData?.mode, data, modalData?.rowIndex)
  }

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  const handleMoveMenuClick = async () => {
    const selectedMenu = menus.find((menu) => menu.property.id === watchMenuId)
    if (!selectedMenu) {
      toast.warn('Menu 정보를 찾을 수 없습니다.')
      return
    }

    const menuInfo = await getMenu(selectedMenu.id)
    if (!menuInfo) {
      toast.warn('Menu 정보를 찾을 수 없습니다.')
      return
    }

    router.push(`/defines/global/menu/${menuInfo.property.rootId}`)
  }

  const handleOpenFlow = async () => {
    const selectedMenu = menus.find((menu) => menu.property.id === watchMenuId)
    if (!selectedMenu) {
      toast.warn('Menu 정보를 찾을 수 없습니다.')
      return
    }

    const menuInfo = await getMenu(selectedMenu.id)
    if (!menuInfo) {
      toast.warn('Menu 정보를 찾을 수 없습니다.')
      return
    }

    const subFlowName = menuInfo.property.subFlowName
    if (!subFlowName) {
      toast.info('SubFlow 정보를 찾을 수 없습니다.')
      return
    }

    const subFlowList = await getInFlows()
    const subFlow = subFlowList.flow.find(({ name }) => name === subFlowName)
    if (!subFlow) {
      toast.info('SubFlow 정보를 찾을 수 없습니다.')
      return
    }

    router.push(`/subflows/${subFlow.id}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <ModalContent>
        <div className="space-y-6">
          <div className="flex gap-3">
            <FormRadioGroup control={control} name="branchType">
              <div className="flex items-center space-x-5">
                <div className="flex gap-3">
                  <RadioGroupItem value="Condition" id="condition" />
                  <Label htmlFor="condition">Condition</Label>
                </div>
                <div className="flex gap-3">
                  <RadioGroupItem
                    value="Default"
                    id="default"
                    disabled={
                      modalData?.mode === 'update' &&
                      modalData?.data?.branchType === 'Default' &&
                      watchBranchType === 'Condition'
                        ? false
                        : disable
                    }
                  />
                  <Label htmlFor="default">Default</Label>
                </div>
              </div>
            </FormRadioGroup>
          </div>
          <div className="space-y-3">
            <h3>Compare Condition</h3>
            <FormAutocomplete
              control={control}
              name="comCondition"
              options={options}
              selectOptions={SELECT_CONDITION_OPTIONS}
              disabled={watchBranchType === 'Default'}
              autoFocus
              onValueChange={onValueChange}
            />
            {errors.comCondition && (
              <span className="error-msg">{errors.comCondition.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Name</h3>
            <FormAutocomplete
              control={control}
              name="name"
              options={options}
              onValueChange={onValueChange}
            />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          <FormCheckbox
            control={control}
            name="useExpression"
            label="Use Expression"
          />
          <div className="space-y-3">
            <h3>Menu ID</h3>
            <FormAutocomplete
              control={control}
              name="menuId"
              options={options}
              selectOptions={menus.map((menu) => menu.property.id)}
              onValueChange={onValueChange}
            />
            <Input value={menuName} readOnly={true} onChange={() => {}} />
            {errors.menuId && (
              <span className="error-msg">{errors.menuId.message}</span>
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-blue-600">
                ※ 페이지를 이동하면 변경사항이 저장되지 않습니다.
              </span>
              <>
                <Button
                  className="w-24"
                  variant="secondary3"
                  onClick={handleMoveMenuClick}
                  disabled={!watchMenuId}
                >
                  Move Menu
                </Button>
                <Button
                  className="w-24"
                  variant="secondary3"
                  onClick={handleOpenFlow}
                  disabled={!watchMenuId}
                >
                  Open Flow
                </Button>
              </>
            </div>
          </div>
          <div className="space-y-3">
            <h3>Condition</h3>
            <FormAutocomplete control={control} name="condition" />
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
