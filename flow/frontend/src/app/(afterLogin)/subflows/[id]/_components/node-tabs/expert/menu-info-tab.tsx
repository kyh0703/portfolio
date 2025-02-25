'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import { Checkbox } from '@/app/_components/checkbox'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { MenuCallInfo } from '@/models/property/flow'
import { getInFlows } from '@/services/flow'
import { getMenu, useQueryMenus } from '@/services/menu'
import logger from '@/utils/logger'
import { removeDuplicateMenus } from '@/utils/options'
import { getMenuPath, getSubFlowPath } from '@/utils/route-path'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { toast } from 'react-toastify'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function MenuInfoTab(props: NodePropertyTabProps) {
  const router = useRouter()
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const menuInfo = getValues(props.tabName) as MenuCallInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const { data: menus } = useSuspenseQuery({
    ...useQueryMenus(),
    select: (data) => removeDuplicateMenus(data),
  })

  const menuName = useMemo(() => {
    if (menuInfo?.menuId) {
      const menu = menus.find((menu) => menu.property.id === menuInfo.menuId)
      if (menu) return menu.property.name
    }
    return ''
  }, [menuInfo?.menuId, menus])

  const findTargetMenu = (menuId: string) => {
    const targetMenu = menus.find((menu) => menu.property.id === menuId)
    if (!targetMenu) {
      toast.warn('Menu 정보를 찾을 수 없습니다.')
      return null
    }
    return targetMenu
  }

  const handleMoveMenuClick = async () => {
    debugger
    const targetMenu = findTargetMenu(menuInfo!.menuId)
    if (!targetMenu) return

    try {
      const menuDetails = await getMenu(targetMenu.id)
      if (!menuDetails) {
        toast.warn('Menu 정보를 찾을 수 없습니다.')
        return
      }
      router.push(getMenuPath(menuDetails.property.rootId))
    } catch (error) {
      logger.error('Menu 정보를 찾을 수 없습니다.', error)
    }
  }

  const handleOpenFlow = async () => {
    const targetMenu = findTargetMenu(menuInfo!.menuId)
    if (!targetMenu) return

    const targetMenuName = targetMenu.property.name

    try {
      const menuDetails = await getMenu(targetMenu.id)
      if (!menuDetails) {
        toast.warn('Menu 정보를 찾을 수 없습니다.')
        return
      }

      const subFlowName = menuDetails.property.subFlowName
      if (!subFlowName) {
        toast.info(`${targetMenuName}의 SubFlow 정보를 찾을 수 없습니다.`)
        return
      }

      const subFlowList = await getInFlows()
      const targetSubFlow = subFlowList.flow.find(
        ({ name }) => name === subFlowName,
      )
      if (!targetSubFlow) {
        toast.info(`${targetMenuName}의 SubFlow 정보를 찾을 수 없습니다.`)
        return
      }

      router.push(getSubFlowPath(targetSubFlow.id))
    } catch (error) {
      logger.error('Menu 정보를 찾을 수 없습니다.', error)
    }
  }

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="flex gap-3">
        <Checkbox id="useExpression" />
        <Label htmlFor="useExpression">Using Expression</Label>
      </div>
      <div className="space-y-2">
        <h3>Menu ID</h3>
        <Autocomplete
          name="menuInfo.menuId"
          value={menuInfo?.menuId}
          options={options}
          selectOptions={menus.map((menu) => menu.property.id)}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        <Input value={menuName} readOnly={true} onChange={() => {}} />
        {errors.menuInfo?.menuId && (
          <span className="error-msg">{errors.menuInfo.menuId.message}</span>
        )}
        <div className="flex justify-between space-x-2">
          <Button
            className="w-25 grow"
            variant="secondary3"
            disabled={!menuInfo?.menuId}
            onClick={handleMoveMenuClick}
          >
            Move Menu
          </Button>
          <Button
            className="w-25 grow"
            variant="secondary3"
            disabled={!menuInfo?.menuId}
            onClick={handleOpenFlow}
          >
            Open Flow
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="menuInfo.condition"
          value={menuInfo?.condition}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.menuInfo?.condition && (
          <span className="error-msg">{errors.menuInfo.condition.message}</span>
        )}
      </div>
    </div>
  )
}
