'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { MenuCallInfo } from '@/models/property/flow'
import { useQueryMenus } from '@/services/menu'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { NodePropertyTabProps } from '../node-property/types'
import { removeDuplicateMenus } from '@/utils/options'

export default function MenuInfoTab(props: NodePropertyTabProps) {
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

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="flex gap-3">
        <Checkbox id="useExpression" />
        <Label htmlFor="useExpression">Using Expression</Label>
      </div>
      <div className="space-y-3">
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
