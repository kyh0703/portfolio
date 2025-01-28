import type { EditMode } from '@/store/sub-flow'

export const getCursorMode = (mode: EditMode) => {
  switch (mode) {
    case 'grab':
      return 'cursor-grab'
    case 'link':
      return 'cursor-crosshair'
    default:
      return 'cursor-default'
  }
}
