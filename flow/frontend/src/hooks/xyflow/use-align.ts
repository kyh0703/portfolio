import { useUpdateEdge, useUpdateNodes } from '@/services/subflow'
import logger from '@/utils/logger'
import {
  useReactFlow,
  useStoreApi,
  type AppEdge,
  type AppNode,
  type XYPosition,
} from '@xyflow/react'
import { useCallback, useMemo } from 'react'
import { useEdges, useUndoRedo } from '.'

export function useAlign(subFlowId: number) {
  const store = useStoreApi<AppNode, AppEdge>()
  const { updateEdgeToDB } = useEdges()
  const { syncSaveHistory } = useUndoRedo(subFlowId)
  const { getInternalNode, getNodes, setNodes, updateEdge } = useReactFlow<
    AppNode,
    AppEdge
  >()

  const { mutateAsync: updateNodesMutate } = useUpdateNodes()

  const canAlignNode = useMemo(() => {
    const selectedNodes = getNodes().filter((node) => node.selected)
    const alignSelectedNodes = selectedNodes.filter((node) => !node.parentId)
    return alignSelectedNodes.length > 1
  }, [getNodes])

  const alignNode = useCallback(
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

  const alignEdge = useCallback(
    async (edge: AppEdge) => {
      if (!edge.data?.points) {
        return
      }

      const sourceNode = getInternalNode(edge.source)
      const targetNode = getInternalNode(edge.target)
      if (!sourceNode || !targetNode) {
        return
      }

      try {
        const sourceX =
          sourceNode.internals.positionAbsolute.x + (sourceNode.width ?? 0) / 2
        const sourceY =
          sourceNode.internals.positionAbsolute.y + (sourceNode.height ?? 0) / 2
        const targetX =
          targetNode.internals.positionAbsolute.x + (targetNode.width ?? 0) / 2
        const targetY =
          targetNode.internals.positionAbsolute.y + (targetNode.height ?? 0) / 2

        if (
          (sourceX === targetX || sourceY === targetY) &&
          edge.data.points.length === 1
        ) {
          edge.data.points = undefined
          await updateEdgeToDB(edge)
          updateEdge(edge.id, edge)
          return
        }

        for (let i = 0; i < edge.data.points.length; i++) {
          const prev: XYPosition = edge.data.points[i - 1] ?? {
            x: sourceX,
            y: sourceY,
          }
          const next: XYPosition = edge.data.points[i + 1] ?? {
            x: targetX,
            y: targetY,
          }
          const current: XYPosition = edge.data.points[i]

          const candidate1: XYPosition = { x: prev.x, y: next.y }
          const candidate2: XYPosition = { x: next.x, y: prev.y }

          const dist1 = Math.hypot(
            current.x - candidate1.x,
            current.y - candidate1.y,
          )
          const dist2 = Math.hypot(
            current.x - candidate2.x,
            current.y - candidate2.y,
          )
          const newPoint = dist1 < dist2 ? candidate1 : candidate2
          edge.data.points[i].x = newPoint.x
          edge.data.points[i].y = newPoint.y
        }

        await updateEdgeToDB(edge)
        updateEdge(edge.id, edge)
      } catch (error) {
        logger.error('Failed to update edge', error)
      }
    },
    [getInternalNode, updateEdge, updateEdgeToDB],
  )

  return { canAlignNode, alignNode, alignEdge }
}
