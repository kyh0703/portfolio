import type { MenuCheckOption } from '@/models/define'

export const defaultTrackingOption: Pick<MenuCheckOption, 'tracking'> = {
  tracking: {
    check: false,
    ment: {
      caption: false,
      choice: false,
      digitError: {
        check: false,
        errorMent: {
          timeout: false,
          input: false,
          retry: false,
        },
      },
      vrError: {
        check: false,
        errorMent: {
          timeout: false,
          input: false,
          retry: false,
        },
      },
    },
  },
}

export const defaultControlOption: Pick<MenuCheckOption, 'control'> = {
  control: {
    block: false,
    tracking: false,
    vr: false,
  },
}
