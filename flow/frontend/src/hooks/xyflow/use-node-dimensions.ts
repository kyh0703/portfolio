import { useReactFlow, type AppEdge, type AppNode } from '@xyflow/react'

export function useNodeDimensions(id: string) {
  const { getNode } = useReactFlow<AppNode, AppEdge>()
  const node = getNode(id)

  return {
    width: node?.width || 0,
    height: node?.height || 0,
  }
}
