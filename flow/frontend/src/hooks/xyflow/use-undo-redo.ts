import { useYjs } from '@/contexts/yjs-context'
import { getRedo, getUndo, useAddHistory } from '@/services/flow'
import {
  sortNode,
  toAppEdge,
  toAppNode,
  toModelEdge,
  toModelNode,
} from '@/utils'
import logger from '@/utils/logger'
import { useReactFlow, type AppEdge, type AppNode } from '@xyflow/react'
import { useCallback, useMemo, useRef } from 'react'
import useYjsData from '../use-yjs-data'

export type HistoryType =
  | 'create' // now
  | 'update' // past
  | 'delete' // now
  | 'group' // now
  | 'ungroup' // now

export function useUndoRedo(flowId: number) {
  const isProcessingRef = useRef(false)

  const { ydoc } = useYjs()
  const { sharedNodePropertiesMap, sharedHistoryMap } = useYjsData(ydoc)

  const id = useMemo(() => '' + flowId, [flowId])
  const { getNodes, getNode, setNodes, getEdges, setEdges, deleteElements } =
    useReactFlow<AppNode, AppEdge>()
  const history = sharedHistoryMap.get(id) ?? { undoCount: 0, redoCount: 0 }

  const { mutate: addHistoryMutate } = useAddHistory()
  const { mutateAsync: addHistoryMutateAsync } = useAddHistory()

  const doCreateItems = useCallback(
    (targetNodes: AppNode[], targetEdges: AppEdge[]) => {
      const nodes = getNodes().filter(
        (node) => !targetNodes.some((n) => n.id === node.id),
      )
      const edges = getEdges().filter(
        (edge) => !targetEdges.some((e) => e.id === edge.id),
      )
      targetNodes.forEach((node) => nodes.push(node))
      targetEdges.forEach((edge) => edges.push(edge))
      setNodes(nodes.sort(sortNode))
      setEdges(edges)
    },
    [getEdges, getNodes, setEdges, setNodes],
  )

  const doUpdateItems = useCallback(
    (targetNodes: AppNode[], targetEdges: AppEdge[]) => {
      if (targetNodes.length > 0) {
        setNodes((nodes) =>
          nodes.map((node) => {
            const actionNode = targetNodes.find((n) => n.id === node.id)
            if (!actionNode) {
              return node
            }
            return {
              ...node,
              ...actionNode,
            }
          }),
        )
      }

      if (targetEdges.length > 0) {
        setEdges((edges) =>
          edges.map((edge) => {
            const actionEdge = targetEdges.find((e) => e.id === edge.id)
            if (!actionEdge) {
              return edge
            }
            return {
              ...edge,
              ...actionEdge,
            }
          }),
        )
      }
    },
    [setEdges, setNodes],
  )

  const doDeleteItems = useCallback(
    (actionNodes: AppNode[], actionEdges: AppEdge[]) => {
      deleteElements({ nodes: actionNodes, edges: actionEdges })
      actionNodes.forEach((node) =>
        sharedNodePropertiesMap.delete('' + node.data.databaseId!),
      )
    },
    [deleteElements, sharedNodePropertiesMap],
  )

  const doGroupNodes = useCallback(
    (targetNodes: AppNode[]) => {
      const nodes = getNodes().map((node) => {
        return targetNodes.find((n) => n.id === node.id) ?? node
      })
      setNodes(nodes.sort(sortNode))
    },
    [getNodes, setNodes],
  )

  const doUngroupNodes = useCallback(
    (targetNodes: AppNode[]) => {
      const nextNodes = getNodes().map((node) => {
        const targetNode = targetNodes.find((node) => node.id === node.id)
        if (!targetNode) {
          return node
        }

        const parentNode = getNode(node.parentId!)
        return parentNode?.parentId
          ? {
              ...node,
              data: { ...targetNode.data },
              position: {
                x: node.position.x + (parentNode.position.x ?? 0),
                y: node.position.y + (parentNode.position.y ?? 0),
              },
              parentId: parentNode.parentId,
            }
          : {
              ...node,
              data: { ...targetNode.data },
              position: {
                x: node.position.x + (parentNode?.position?.x ?? 0),
                y: node.position.y + (parentNode?.position?.y ?? 0),
              },
              expandParent: undefined,
              parentId: '',
            }
      })
      setNodes(nextNodes)
    },
    [getNode, getNodes, setNodes],
  )

  const syncSaveHistory = useCallback(
    async (type: HistoryType, nodes: AppNode[], edges: AppEdge[]) => {
      if (nodes.length === 0 && edges.length === 0) {
        return
      }

      try {
        const response = await addHistoryMutateAsync({
          flowId,
          data: {
            type,
            nodes: nodes.map((node) => toModelNode(node)),
            edges: edges.map((edge) => toModelEdge(edge)),
          },
        })

        sharedHistoryMap.set(id, {
          undoCount: response.undoCount,
          redoCount: response.redoCount,
        })
      } catch (error) {
        logger.debug('Failed to save history', error)
      }
    },
    [addHistoryMutateAsync, flowId, id, sharedHistoryMap],
  )

  const saveHistory = useCallback(
    (type: HistoryType, nodes: AppNode[], edges: AppEdge[]) => {
      if (nodes.length === 0 && edges.length === 0) {
        return
      }

      addHistoryMutate(
        {
          flowId,
          data: {
            type,
            nodes: nodes.map((node) => toModelNode(node)),
            edges: edges.map((edge) => toModelEdge(edge)),
          },
        },
        {
          onSuccess: (response) => {
            sharedHistoryMap.set(id, {
              undoCount: response.undoCount,
              redoCount: response.redoCount,
            })
          },
        },
      )
    },
    [addHistoryMutate, flowId, id, sharedHistoryMap],
  )

  const undo = useCallback(async () => {
    if (history.undoCount < 1) {
      return
    }
    if (isProcessingRef.current) {
      return
    }
    isProcessingRef.current = true

    try {
      const response = await getUndo(flowId)
      const nodes = response.nodes.map((node) => toAppNode(node))
      const edges = response.edges.map((edge) => toAppEdge(edge))

      switch (response.type) {
        case 'create':
          doDeleteItems(nodes, edges)
          break
        case 'update':
          doUpdateItems(nodes, edges)
          break
        case 'delete':
          doCreateItems(nodes, edges)
          break
        case 'group':
          doUngroupNodes(nodes)
          break
        case 'ungroup':
          doGroupNodes(nodes)
          break
        default:
          return
      }

      sharedHistoryMap.set(id, {
        undoCount: response.undocnt,
        redoCount: response.redocnt,
      })
    } catch (error) {
      logger.error('Failed to undo', error)
    } finally {
      isProcessingRef.current = false
    }
  }, [
    doCreateItems,
    doDeleteItems,
    doGroupNodes,
    doUngroupNodes,
    doUpdateItems,
    flowId,
    history.undoCount,
    id,
    sharedHistoryMap,
  ])

  const redo = useCallback(async () => {
    if (history.redoCount < 1) {
      return
    }
    if (isProcessingRef.current) {
      return
    }
    isProcessingRef.current = true

    try {
      const response = await getRedo(flowId)
      const nodes = response.nodes.map((node) => toAppNode(node))
      const edges = response.edges.map((edge) => toAppEdge(edge))

      switch (response.type) {
        case 'create':
          doCreateItems(nodes, edges)
          break
        case 'update':
          doUpdateItems(nodes, edges)
          break
        case 'delete':
          doDeleteItems(nodes, edges)
          break
        case 'group':
          doGroupNodes(nodes)
          break
        case 'ungroup':
          doUngroupNodes(nodes)
          break
        default:
          return
      }

      sharedHistoryMap.set(id, {
        undoCount: response.undocnt,
        redoCount: response.redocnt,
      })
    } catch (error) {
      logger.error('Failed to redo', error)
    } finally {
      isProcessingRef.current = false
    }
  }, [
    doCreateItems,
    doDeleteItems,
    doGroupNodes,
    doUngroupNodes,
    doUpdateItems,
    flowId,
    history.redoCount,
    id,
    sharedHistoryMap,
  ])

  return {
    canUndo: history.undoCount > 0 || false,
    canRedo: history.redoCount > 0 || false,
    undo,
    redo,
    saveHistory,
    syncSaveHistory,
  }
}
