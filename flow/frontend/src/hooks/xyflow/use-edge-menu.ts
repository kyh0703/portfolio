import { toPoints } from '@/utils'
import logger from '@/utils/logger'
import {
  useReactFlow,
  type AppEdge,
  type AppNode,
  type Connection,
  type CustomEdgeType,
} from '@xyflow/react'
import isEqual from 'lodash-es/isEqual'
import { useCallback } from 'react'
import { useEdges, useNodes, useUndoRedo } from '.'

export function useEdgeMenu(
  connection: Connection,
  sourceNode: AppNode,
  targetNode: AppNode,
) {
  const { deleteElements } = useReactFlow<AppNode, AppEdge>()
  const { getGhostNodesBySource } = useNodes()
  const {
    edgeFactory,
    addEdgeToDB,
    updateEdgeConnectionToDB,
    removeEdgeToDB,
    getEdgesBySource,
    getEdgesByTarget,
  } = useEdges()
  const subFlowId = sourceNode.data.subFlowId!
  const edgeType = sourceNode.type as CustomEdgeType
  const sourceEdges = getEdgesBySource(sourceNode.id)
  const targetEdges = getEdgesByTarget(targetNode.id)
  const { saveHistory, syncSaveHistory } = useUndoRedo(subFlowId)

  const onSelect = useCallback(
    async (value: string) => {
      const oldEdge = sourceEdges.find((edge) => edge.data!.condition === value)
      const targetEdge = targetEdges.find(
        (edge) =>
          edge.source === sourceNode.id && edge.data!.condition === value,
      )
      const ghostNodes = getGhostNodesBySource(sourceNode.id)
      const points = toPoints(ghostNodes)
      deleteElements({ nodes: ghostNodes })

      try {
        if (targetEdge && targetEdge.id !== oldEdge?.id) {
          await syncSaveHistory('delete', [], [targetEdge])
          await removeEdgeToDB(targetEdge)
        }

        if (oldEdge) {
          if (
            oldEdge.target === connection.target &&
            isEqual(oldEdge.data?.points, points)
          ) {
            return
          }
          saveHistory('update', [], [oldEdge])
          oldEdge.data!.points = points
          await updateEdgeConnectionToDB(oldEdge, connection)
        } else {
          const newEdge = edgeFactory(
            subFlowId,
            connection,
            edgeType,
            value!,
            points,
          )
          if (!newEdge) {
            return
          }
          const databaseId = await addEdgeToDB(subFlowId, newEdge)
          newEdge.data!.databaseId = databaseId
          saveHistory('create', [], [newEdge])
        }
      } catch (error) {
        logger.error('Failed to add edge', error)
      }
    },
    [
      addEdgeToDB,
      connection,
      deleteElements,
      edgeFactory,
      edgeType,
      getGhostNodesBySource,
      removeEdgeToDB,
      saveHistory,
      sourceEdges,
      sourceNode.id,
      subFlowId,
      syncSaveHistory,
      targetEdges,
      updateEdgeConnectionToDB,
    ],
  )

  return { sourceEdges, onSelect }
}
