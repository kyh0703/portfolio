import type { MenuCheckOption } from '@/models/define'
import type { CheckboxItem } from './types'
import set from 'lodash-es/set'

export const convertTrackingItem = (
  trackingOption: Pick<MenuCheckOption, 'tracking'>,
): CheckboxItem[] => {
  return [
    {
      id: 'tracking.check',
      name: 'Tracking',
      checked: trackingOption.tracking?.check || false,
      children: [
        {
          id: 'tracking.ment.caption',
          name: 'Caption',
          checked: trackingOption.tracking?.ment.caption || false,
        },
        {
          id: 'tracking.ment.choice',
          name: 'Choice',
          checked: trackingOption.tracking?.ment.choice || false,
        },
        {
          id: 'tracking.ment.digitError.check',
          name: 'Digit Error',
          checked: trackingOption.tracking?.ment.digitError.check || false,
          children: [
            {
              id: 'tracking.ment.digitError.errorMent.timeout',
              name: 'Timeout',
              checked:
                trackingOption.tracking?.ment.digitError.errorMent.timeout ||
                false,
            },
            {
              id: 'tracking.ment.digitError.errorMent.input',
              name: 'Input',
              checked:
                trackingOption.tracking?.ment.digitError.errorMent.input ||
                false,
            },
            {
              id: 'tracking.ment.digitError.errorMent.retry',
              name: 'Retry',
              checked:
                trackingOption.tracking?.ment.digitError.errorMent.retry ||
                false,
            },
          ],
        },
        {
          id: 'tracking.ment.vrError.check',
          name: 'VR Error',
          checked: trackingOption.tracking?.ment.vrError.check || false,
          children: [
            {
              id: 'tracking.ment.vrError.errorMent.timeout',
              name: 'VR Timeout',
              checked:
                trackingOption.tracking?.ment.vrError.errorMent.timeout ||
                false,
            },
            {
              id: 'tracking.ment.vrError.errorMent.input',
              name: 'VR Input',
              checked:
                trackingOption.tracking?.ment.vrError.errorMent.input || false,
            },
            {
              id: 'tracking.ment.vrError.errorMent.retry',
              name: 'VR Retry',
              checked:
                trackingOption.tracking?.ment.vrError.errorMent.retry || false,
            },
          ],
        },
      ],
    },
  ]
}

export const convertControlItem = (
  controlOption: Pick<MenuCheckOption, 'control'>,
): CheckboxItem[] => {
  return [
    {
      id: 'control.block',
      name: 'Block',
      checked: controlOption.control?.block || false,
    },
    {
      id: 'control.tracking',
      name: 'Tracking',
      checked: controlOption.control?.tracking || false,
    },
    {
      id: 'control.vr',
      name: 'VR',
      checked: controlOption.control?.vr || false,
    },
  ]
}

export const convertMenuOption = (
  checkboxItems: CheckboxItem[],
): MenuCheckOption => {
  let menuCheckOption: MenuCheckOption = {}

  const updateMenuCheckOption = (items: CheckboxItem[]) => {
    items.forEach((item) => {
      set(menuCheckOption, item.id, item.checked)

      if (item.children) {
        updateMenuCheckOption(item.children)
      }
    })
  }

  updateMenuCheckOption(checkboxItems)
  return menuCheckOption
}
