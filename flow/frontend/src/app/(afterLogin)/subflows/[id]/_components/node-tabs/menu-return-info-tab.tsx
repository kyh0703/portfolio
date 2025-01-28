'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import { Checkbox } from '@/app/_components/checkbox'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import { RadioGroup, RadioGroupItem } from '@/app/_components/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { MENU_RETURN_OPTIONS } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { MenuReturnInfo } from '@/models/property/flow'
import { getInFlows } from '@/services/flow'
import { getMenu, useQueryMenus } from '@/services/menu'
import { cn } from '@/utils'
import { removeDuplicateMenus } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { NodePropertyTabProps } from '../node-property/types'

export default function MenuReturnInfoTab(props: NodePropertyTabProps) {
  const router = useRouter()
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as MenuReturnInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const { data: menus } = useSuspenseQuery({
    ...useQueryMenus(),
    select: (data) => removeDuplicateMenus(data),
  })

  const menuName = useMemo(() => {
    if (info?.menuId) {
      const menu = menus.find((menu) => menu.property.id === info.menuId)
      if (menu) return menu.property.name
    }
    return ''
  }, [info?.menuId, menus])

  const handleMoveMenuClick = useCallback(async () => {
    const selectedMenu = menus.find((menu) => menu.property.id === info?.menuId)
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
  }, [info?.menuId, menus, router])

  const handleOpenFlow = useCallback(async () => {
    const selectedMenu = menus.find((menu) => menu.property.id === info?.menuId)
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
  }, [info?.menuId, menus, router])

  return (
    <RadioGroup
      value={info?.type}
      className={cn('w-full')}
      onValueChange={(value) => setValue('info.type', value)}
    >
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <div className="flex gap-3">
            <RadioGroupItem value="Return Type" id="r1" />
            <Label htmlFor="r1">Return Type</Label>
          </div>
          <div className="pl-5">
            <Select
              value={info?.returnType}
              disabled={info?.type !== 'Return Type'}
              onValueChange={(value) => setValue('info.returnType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MENU_RETURN_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option.split(':')[0]}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.info?.type && (
              <span className="error-msg">{errors.info.type.message}</span>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex gap-3">
            <RadioGroupItem value="Goto Special Menu" id="r2" />
            <Label htmlFor="r2">Goto Special Menu</Label>
          </div>
          <div className="space-y-3 pl-5">
            <div className="flex gap-3">
              <Checkbox
                id="useExpression"
                checked={info?.useExpression}
                disabled={info?.type !== 'Goto Special Menu'}
                onCheckedChange={(checked) =>
                  setValue('info.useExpression', !!checked)
                }
              />
              <Label htmlFor="useExpression">Using Expression</Label>
            </div>
            <div className="space-y-2">
              <h3>Menu ID</h3>
              <Autocomplete
                name="info.menuId"
                value={info?.menuId}
                disabled={info?.type !== 'Goto Special Menu'}
                options={options}
                selectOptions={menus.map((menu) => menu.property.id)}
                onChange={setValue}
                onValueChange={onValueChange}
              />
              <Input value={menuName} readOnly={true} onChange={() => {}} />
              {errors.info?.menuId && (
                <span className="error-msg">{errors.info.menuId.message}</span>
              )}
              <div className="flex justify-between space-x-2">
                <Button
                  className={cn('w-25 grow')}
                  variant="secondary3"
                  disabled={info?.type !== 'Goto Special Menu' || !info?.menuId}
                  onClick={handleMoveMenuClick}
                >
                  Move Menu
                </Button>
                <Button
                  className={cn('w-25 grow')}
                  variant="secondary3"
                  disabled={info?.type !== 'Goto Special Menu' || !info?.menuId}
                  onClick={handleOpenFlow}
                >
                  Open Flow
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RadioGroup>
  )
}
