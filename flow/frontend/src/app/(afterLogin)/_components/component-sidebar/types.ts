import {
  PlayIcon,
  type IconButtonProps
} from '@/app/_components/icon'
import type { CustomNodeType } from '@xyflow/react'

export type ComponentItem = {
  title: string
  nodeType: CustomNodeType
  icon: React.ComponentType<IconButtonProps>
}

export const components: Record<string, ComponentItem[]> = {
  basic: [
    {
      title: 'Play',
      nodeType: 'Play',
      icon: PlayIcon,
    },
  ],
}
