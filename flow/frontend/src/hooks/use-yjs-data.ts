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
    (flowId: number) => {
      const id = '' + flowId
      if (!sharedCursorsMap.has(id)) {
        sharedCursorsMap.set(id, new Y.Map<Cursor>())
      }
      return sharedCursorsMap.get(id)!
    },
    [sharedCursorsMap],
  )

  const getNodesMap = useCallback(
    (flowId: number) => {
      const id = '' + flowId
      if (!sharedNodesMap.has(id)) {
        sharedNodesMap.set(id, new Y.Map<AppNode>())
      }
      return sharedNodesMap.get(id)!
    },
    [sharedNodesMap],
  )

  const getEdgesMap = useCallback(
    (flowId: number) => {
      const id = '' + flowId
      if (!sharedEdgesMap.has(id)) {
        sharedEdgesMap.set(id, new Y.Map<AppEdge>())
      }
      return sharedEdgesMap.get(id)!
    },
    [sharedEdgesMap],
  )

  const clearFlow = useCallback(
    (flowId: string) => {
      sharedCursorsMap.delete(flowId)
      const nodesMap = sharedNodesMap.get(flowId)
      if (nodesMap) {
        for (const node of nodesMap.values()) {
          sharedNodePropertiesMap.delete('' + node.data.databaseId)
        }
      }
      sharedNodesMap.delete(flowId)
      sharedEdgesMap.delete(flowId)
      sharedHistoryMap.delete(flowId)
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
    clearFlow,
  }
}
