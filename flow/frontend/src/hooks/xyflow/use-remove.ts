import { useYjs } from '@/contexts/yjs-context'
import { useRemoveEdges, useRemoveNodes } from '@/services/flow'
import logger from '@/utils/logger'
import {
  getConnectedEdges,
  useReactFlow,
  type AppEdge,
  type AppNode,
} from '@xyflow/react'
import { useCallback, useRef } from 'react'
import useYjsData from '../use-yjs-data'
import { useEdges } from './use-edges'
import { useNodes } from './use-nodes'
import { useUndoRedo } from './use-undo-redo'

export function useRemove(flowId: number) {
  const isProcessingRef = useRef(false)

  const { ydoc } = useYjs()
  const { sharedNodePropertiesMap } = useYjsData(ydoc)
  const { getNode, getNodes, getEdges, deleteElements } = useReactFlow<
    AppNode,
    AppEdge
  >()
  const { syncSaveHistory } = useUndoRedo(flowId)
  const { getSelectedNodes } = useNodes()
  const { getSelectedEdgesByNodes } = useEdges()
  const { mutateAsync: removeNodesMutate } = useRemoveNodes()
  const { mutateAsync: removeEdgesMutate } = useRemoveEdges()

  const removeSelectedNode = useCallback(async () => {
    if (isProcessingRef.current) {
      return
    }
    isProcessingRef.current = true

    try {
      const selectedNodes = getSelectedNodes()
      const selectedEdges = getSelectedEdgesByNodes(selectedNodes)
      const dbTxNodes = selectedNodes.filter((node) => node.type !== 'Ghost')
      const dbTxNodeIds = dbTxNodes.map((node) => ({
        id: node.data.databaseId!,
      }))
      const dbTxEdges = selectedEdges.filter((edge) => edge.type !== 'Ghost')
      const dbTxEdgeIds = dbTxEdges.map((edge) => ({
        id: edge.data!.databaseId!,
      }))
      if (selectedNodes.length === 0 && selectedEdges.length === 0) {
        isProcessingRef.current = false
        return
      }
      await syncSaveHistory('delete', dbTxNodes, dbTxEdges)
      await removeNodesMutate(dbTxNodeIds)
      await removeEdgesMutate(dbTxEdgeIds)
      dbTxNodeIds.forEach((node) => {
        sharedNodePropertiesMap.delete('' + node.id)
      })
      deleteElements({ nodes: selectedNodes, edges: selectedEdges })
    } catch (error) {
      logger.error('failed to remove nodes', error)
      return
    } finally {
      isProcessingRef.current = false
    }
  }, [
    deleteElements,
    getSelectedEdgesByNodes,
    getSelectedNodes,
    removeEdgesMutate,
    removeNodesMutate,
    sharedNodePropertiesMap,
    syncSaveHistory,
  ])

  const canRemove = useCallback((): boolean => {
    return (
      getNodes().some((node) => node.selected) ||
      getEdges().some((edge) => edge.selected) ||
      !isProcessingRef.current
    )
  }, [getEdges, getNodes])

  const removeNode = useCallback(
    async (nodeId: string) => {
      if (isProcessingRef.current) {
        return
      }
      isProcessingRef.current = true

      try {
        const node = getNode(nodeId)
        if (!node) {
          return
        }

        const selectedNodes = [node]
        const selectedEdges = getConnectedEdges(selectedNodes, getEdges())
        const dbTxNodes = selectedNodes.filter((node) => node.type !== 'Ghost')
        const dbTxNodeIds = selectedNodes.map((node) => ({
          id: node.data.databaseId!,
        }))
        const dbTxEdges = selectedEdges.filter((edge) => edge.type !== 'Ghost')
        const dbTxEdgeIds = selectedEdges.map((edge) => ({
          id: edge.data!.databaseId!,
        }))

        if (selectedNodes.length === 0 && selectedEdges.length === 0) {
          Promise.resolve()
        }

        await syncSaveHistory('delete', dbTxNodes, dbTxEdges)
        await removeNodesMutate(dbTxNodeIds)
        await removeEdgesMutate(dbTxEdgeIds)
        dbTxNodes.forEach((node) => {
          sharedNodePropertiesMap.delete('' + node.id)
        })
        deleteElements({ nodes: selectedNodes, edges: selectedEdges })
      } catch (error) {
        logger.error('failed to remove nodes', error)
      } finally {
        isProcessingRef.current = false
      }
    },
    [
      deleteElements,
      getEdges,
      getNode,
      removeEdgesMutate,
      removeNodesMutate,
      sharedNodePropertiesMap,
      syncSaveHistory,
    ],
  )

  return { removeSelectedNode, canRemove, removeNode }
}
