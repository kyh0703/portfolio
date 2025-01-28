import { useUpdateNodes } from '@/services/subflow'
import logger from '@/utils/logger'
import {
  useReactFlow,
  useStoreApi,
  type AppEdge,
  type AppNode,
} from '@xyflow/react'
import { useCallback } from 'react'
import { useUndoRedo } from '.'

export function useAlign(subFlowId: number) {
  const { syncSaveHistory } = useUndoRedo(subFlowId)
  const { setNodes } = useReactFlow<AppNode, AppEdge>()
  const store = useStoreApi<AppNode, AppEdge>()
  const { getNodes } = useReactFlow<AppNode, AppEdge>()
  const selectedNodes = getNodes().filter((node) => node.selected)
  const alignSelectedNodes = selectedNodes.filter((node) => !node.parentId)

  const { mutateAsync: updateNodesMutate } = useUpdateNodes()

  const canAlign = useCallback(() => {
    return alignSelectedNodes.length > 1
  }, [alignSelectedNodes.length])

  const align = useCallback(
    async (
      targetNode: AppNode,
      selectedNodes: AppNode[],
      orientation: 'middle' | 'center',
    ) => {
      const direction = orientation === 'center' ? 'x' : 'y'
      const position = targetNode.position[direction]

      const selectedNodeIds = selectedNodes.map((node) => node.id)
      const updateNodes: AppNode[] = []
      const nextNodes: AppNode[] = getNodes().map((node) => {
        if (!selectedNodeIds.includes(node.id)) {
          return node
        }
        const updateNode = {
          ...node,
          position: {
            ...node.position,
            [direction]: position,
          },
        }
        updateNodes.push(updateNode)
        return updateNode
      })

      try {
        await syncSaveHistory('update', selectedNodes, [])
        await updateNodesMutate({ nodes: updateNodes })
      } catch (error) {
        logger.error('Failed to update nodes', error)
        return
      }

      store.getState().resetSelectedElements()
      store.setState({ nodesSelectionActive: false })
      setNodes([...nextNodes])
    },
    [getNodes, setNodes, store, syncSaveHistory, updateNodesMutate],
  )

  return { canAlign, align }
}
