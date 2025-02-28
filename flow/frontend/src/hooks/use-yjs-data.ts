import { hasPropertyNode } from '@/app/(afterLogin)/flow/[id]/_components/flow-main/tools'
import type { FieldValues } from '@/contexts/node-properties-context'
import type { Cursor } from '@/types/collaboration'
import type { AppEdge, AppNode } from '@xyflow/react'
import { useCallback, useMemo } from 'react'
import * as Y from 'yjs'

export default function useYjsData(ydoc: Y.Doc) {
  const sharedCursorsMap = useMemo(
    () => ydoc.getMap<Y.Map<Cursor>>('cursors'),
    [ydoc],
  )
  const sharedNodesMap = useMemo(
    () => ydoc.getMap<Y.Map<AppNode>>('nodes'),
    [ydoc],
  )
  const sharedNodePropertiesMap = useMemo(
    () => ydoc.getMap<FieldValues>('nodeProperties'),
    [ydoc],
  )
  const sharedEdgesMap = useMemo(
    () => ydoc.getMap<Y.Map<AppEdge>>('edges'),
    [ydoc],
  )
  const sharedHistoryMap = useMemo(
    () => ydoc.getMap<{ undoCount: number; redoCount: number }>(`history`),
    [ydoc],
  )

  const getCursorsMap = useCallback(
    (subFlowId: number) => {
      if (!sharedCursorsMap.has('' + subFlowId)) {
        sharedCursorsMap.set('' + subFlowId, new Y.Map<Cursor>())
      }
      return sharedCursorsMap.get('' + subFlowId)!
    },
    [sharedCursorsMap],
  )

  const getNodesMap = useCallback(
    (subFlowId: number) => {
      if (!sharedNodesMap.has('' + subFlowId)) {
        sharedNodesMap.set('' + subFlowId, new Y.Map<AppNode>())
      }
      return sharedNodesMap.get('' + subFlowId)!
    },
    [sharedNodesMap],
  )

  const getEdgesMap = useCallback(
    (subFlowId: number) => {
      if (!sharedEdgesMap.has('' + subFlowId)) {
        sharedEdgesMap.set('' + subFlowId, new Y.Map<AppEdge>())
      }
      return sharedEdgesMap.get('' + subFlowId)!
    },
    [sharedEdgesMap],
  )

  const clearSubFlow = useCallback(
    (subFlowId: string) => {
      sharedCursorsMap.delete(subFlowId)
      const nodesMap = sharedNodesMap.get(subFlowId)
      if (nodesMap) {
        for (const node of nodesMap.values()) {
          if (hasPropertyNode(node.type!)) {
            sharedNodePropertiesMap.delete('' + node.data.databaseId)
          }
        }
      }
      sharedNodesMap.delete(subFlowId)
      sharedEdgesMap.delete(subFlowId)
      sharedHistoryMap.delete(subFlowId)
    },
    [
      sharedCursorsMap,
      sharedEdgesMap,
      sharedHistoryMap,
      sharedNodePropertiesMap,
      sharedNodesMap,
    ],
  )

  return {
    sharedCursorsMap,
    sharedNodesMap,
    sharedNodePropertiesMap,
    sharedEdgesMap,
    sharedHistoryMap,
    getCursorsMap,
    getNodesMap,
    getEdgesMap,
    clearSubFlow,
  }
}
