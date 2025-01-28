'use client'

import { Button } from '@/app/_components/button'
import { Checkbox } from '@/app/_components/checkbox'
import Label from '@/app/_components/label'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { useModalId } from '@/contexts/modal-context'
import type { MenuCheckOption } from '@/models/define'
import { useModalStore } from '@/store/modal'
import { Separator } from '@/ui/separator'
import { useState } from 'react'
import { defaultControlOption, defaultTrackingOption } from './constants'
import type { CheckboxItem } from './types'
import {
  convertControlItem,
  convertMenuOption,
  convertTrackingItem,
} from './util'

type WithChildrenProps = {
  item: CheckboxItem
  level?: number
  onCheck?: (id: string, checked: boolean) => void
}

export function CheckboxWithChildren({
  item,
  level = 0,
  onCheck,
}: WithChildrenProps) {
  return (
    <div className="ml-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={item.id}
          checked={item.checked}
          onCheckedChange={(checked) => onCheck?.(item.id, !!checked)}
        />
        <Label htmlFor={item.id}>{item.name}</Label>
      </div>
      {item.children && (
        <div className="mt-2">
          {item.children.map((child) => (
            <CheckboxWithChildren
              key={child.id}
              item={child}
              level={level + 1}
              onCheck={onCheck}
            />
          ))}
        </div>
      )}
    </div>
  )
}

type MenuOptionModalProps = {
  checkOption?: MenuCheckOption
  onSubmit?: (options: MenuCheckOption) => void
}

export default function MenuOptionModal({
  checkOption,
  onSubmit,
}: MenuOptionModalProps) {
  const id = useModalId()
  const [closeModal] = useModalStore((state) => [state.closeModal])

  const [trackingItems, setTrackingItems] = useState<CheckboxItem[]>(
    convertTrackingItem(checkOption ? checkOption : defaultTrackingOption),
  )
  const [controlItems, setControlItems] = useState<CheckboxItem[]>(
    convertControlItem(checkOption ? checkOption : defaultControlOption),
  )

  const updateCheckedStatus = (
    items: CheckboxItem[],
    id: string,
    checked: boolean,
  ): CheckboxItem[] => {
    return items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          checked,
          children: item.children
            ? updateChildrenChecked(item.children, checked)
            : undefined,
        }
      }

      if (item.children) {
        const updatedChildren = updateCheckedStatus(item.children, id, checked)
        const allChildrenChecked = updatedChildren.every(
          (child) => child.checked,
        )
        return {
          ...item,
          checked: allChildrenChecked,
          children: updatedChildren,
        }
      }

      return item
    })
  }

  const updateChildrenChecked = (
    children: CheckboxItem[],
    checked: boolean,
  ): CheckboxItem[] => {
    return children.map((child) => ({
      ...child,
      checked,
      children: child.children
        ? updateChildrenChecked(child.children, checked)
        : undefined,
    }))
  }

  const handleTrackingCheck = (id: string, checked: boolean) => {
    setTrackingItems((items) => updateCheckedStatus(items, id, checked))
  }

  const handleControlCheck = (id: string, checked: boolean) => {
    setControlItems((items) => updateCheckedStatus(items, id, checked))
  }

  const handleClick = () => {
    const trackingOption = convertMenuOption(trackingItems)
    const controlOption = convertMenuOption(controlItems)
    closeModal(id)
    if (onSubmit) {
      onSubmit({ ...trackingOption, ...controlOption })
    }
  }

  return (
    <>
      <ModalContent>
        <h2 className="p-3">Menu check options apply to all menus.</h2>
        <Separator />
        <h3>Tracking Ment</h3>
        <div className="flex-1 overflow-auto">
          {trackingItems.map((item) => (
            <CheckboxWithChildren
              key={item.id}
              item={item}
              onCheck={handleTrackingCheck}
            />
          ))}
        </div>
        <Separator />
        <h3>Menu Control & Function</h3>
        <div className="flex-1 overflow-auto">
          {controlItems.map((item) => (
            <CheckboxWithChildren
              key={item.id}
              item={item}
              onCheck={handleControlCheck}
            />
          ))}
        </div>
      </ModalContent>
      <ModalAction>
        <Button variant="error" onClick={() => closeModal(id)}>
          Cancel
        </Button>
        <Button onClick={handleClick}>OK</Button>
      </ModalAction>
    </>
  )
}
