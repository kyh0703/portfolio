import {
  useReactFlow,
  type AppEdge,
  type AppNode,
  type CustomNodeType,
} from '@xyflow/react'
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

export function useId() {
  const { getNodes } = useReactFlow<AppNode, AppEdge>()

  const getNodeMaxCount = useCallback(
    (nodeType: CustomNodeType) => {
      let max = 0
      getNodes().forEach((node) => {
        if (node.type === nodeType) {
          const count = parseInt(node.id.split('-')[1])
          max = Math.max(max, count)
        }
      })
      return max
    },
    [getNodes],
  )

  const issueNodeId = useCallback(
    (nodeType: CustomNodeType) => {
      const max = getNodeMaxCount(nodeType)
      return `${nodeType}-${max + 1}`
    },
    [getNodeMaxCount],
  )

  const issueEdgeId = useCallback(() => uuidv4(), [])

  return { getNodeMaxCount, issueNodeId, issueEdgeId }
}
