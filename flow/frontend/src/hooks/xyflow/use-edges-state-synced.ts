import { useYjs } from '@/contexts/yjs-context'
import {
  applyEdgeChanges,
  type AppEdge,
  type OnEdgesChange,
} from '@xyflow/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useYjsData from '../use-yjs-data'

export function useEdgesStateSynced(
  flowId: number,
  initialEdges: AppEdge[],
): [
  AppEdge[],
  React.Dispatch<React.SetStateAction<AppEdge[]>>,
  OnEdgesChange<AppEdge>,
] {
  const { ydoc } = useYjs()
  const { getEdgesMap } = useYjsData(ydoc)
  const edgesMap = useMemo(() => getEdgesMap(flowId), [getEdgesMap, flowId])
  const [edges, setEdges] = useState<AppEdge[]>([])

  const setEdgesSynced = useCallback(
    (edgesOrUpdater: React.SetStateAction<AppEdge[]>) => {
      const next =
        typeof edgesOrUpdater === 'function'
          ? edgesOrUpdater([...edgesMap.values()])
          : edgesOrUpdater
      const seen = new Set<string>()

      next.forEach((edge) => {
        seen.add(edge.id)
        edgesMap.set(edge.id, edge)
      })

      for (const edge of edgesMap.values()) {
        if (!seen.has(edge.id)) {
          edgesMap.delete(edge.id)
        }
      }
    },
    [edgesMap],
  )

  const onEdgesChange: OnEdgesChange<AppEdge> = useCallback(
    (changes) => {
      const edges = Array.from(edgesMap.values())
      const nextEdges = applyEdgeChanges(changes, edges)

      for (const change of changes) {
        switch (change.type) {
          case 'add':
          case 'replace':
            edgesMap.set(change.item.id, change.item)
            break
          case 'remove':
            if (edgesMap.has(change.id)) {
              edgesMap.delete(change.id)
            }
            break
          default:
            edgesMap.set(change.id, nextEdges.find((n) => n.id === change.id)!)
            break
        }
      }
    },
    [edgesMap],
  )

  useEffect(() => {
    const observer = () => {
      setEdges(Array.from(edgesMap.values()))
    }

    const appEdgeIds = new Set(initialEdges.map((edge) => edge.id))
    initialEdges.forEach((edge) => {
      edgesMap.set(edge.id, { ...edgesMap.get(edge.id), ...edge })
    })
    for (const edgeId of edgesMap.keys()) {
      if (!appEdgeIds.has(edgeId)) {
        edgesMap.delete(edgeId)
      }
    }

    setEdges(Array.from(edgesMap.values()))
    edgesMap.observe(observer)

    return () => {
      edgesMap.unobserve(observer)
    }
  }, [edgesMap, initialEdges])

  return [edges, setEdgesSynced, onEdgesChange]
}
