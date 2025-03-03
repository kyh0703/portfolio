import { useYjs } from '@/contexts/yjs-context'
import { getHelperLines, sortNode } from '@/utils'
import {
  applyNodeChanges,
  getConnectedEdges,
  type AppNode,
  type HelperLine,
  type OnNodesChange,
} from '@xyflow/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useYjsData from '../use-yjs-data'

export function useNodesStateSynced(
  flowId: number,
  initialNodes: AppNode[],
): [
  AppNode[],
  React.Dispatch<React.SetStateAction<AppNode[]>>,
  OnNodesChange<AppNode>,
  HelperLine | undefined,
  HelperLine | undefined,
] {
  const { ydoc } = useYjs()
  const { getNodesMap, getEdgesMap } = useYjsData(ydoc)
  const nodesMap = useMemo(() => getNodesMap(flowId), [getNodesMap, flowId])
  const edgesMap = useMemo(() => getEdgesMap(flowId), [getEdgesMap, flowId])

  const [nodes, setNodes] = useState<AppNode[]>([])
  const [verticalLine, setVerticalLine] = useState<HelperLine>(undefined)
  const [horizontalLine, setHorizontalLine] = useState<HelperLine>(undefined)

  const setNodesSynced = useCallback(
    (nodesOrUpdater: React.SetStateAction<AppNode[]>) => {
      const next =
        typeof nodesOrUpdater === 'function'
          ? nodesOrUpdater([...nodesMap.values()])
          : nodesOrUpdater
      const seen = new Set<string>()

      next.forEach((node) => {
        seen.add(node.id)
        nodesMap.set(node.id, node)
      })

      for (const node of nodesMap.values()) {
        if (!seen.has(node.id)) {
          nodesMap.delete(node.id)
        }
      }
    },
    [nodesMap],
  )

  const makeHelperLine: OnNodesChange<AppNode> = useCallback(
    (changes) => {
      setHorizontalLine(undefined)
      setVerticalLine(undefined)

      if (
        changes.length === 1 &&
        changes[0].type === 'position' &&
        changes[0].dragging &&
        changes[0].position
      ) {
        const helperLines = getHelperLines(changes[0], nodes)

        // if we have a helper line, we snap the node to the helper line position
        // this is being done by manipulating the node position inside the change object
        changes[0].position.x =
          helperLines.snapPosition.x ?? changes[0].position.x
        changes[0].position.y =
          helperLines.snapPosition.y ?? changes[0].position.y

        // if helper lines are returned, we set them so that they can be displayed
        setHorizontalLine(helperLines.horizontal)
        setVerticalLine(helperLines.vertical)
      }
    },
    [nodes],
  )

  // The onNodesChange callback updates nodesMap.
  // When the changes are applied to the map, the observer will be triggered and updates the nodes state.
  const onNodesChanges: OnNodesChange<AppNode> = useCallback(
    (changes) => {
      const nodes = Array.from(nodesMap.values())
      makeHelperLine(changes)
      const nextNodes = applyNodeChanges(changes, nodes)

      for (const change of changes) {
        switch (change.type) {
          case 'add':
          case 'replace':
            nodesMap.set(change.item.id, change.item)
            break
          case 'remove':
            if (nodesMap.has(change.id)) {
              const deletedNode = nodesMap.get(change.id)!
              nodesMap.delete(change.id)
              const connectedEdges = getConnectedEdges(
                [deletedNode],
                [...edgesMap.values()],
              )
              connectedEdges.forEach((edge) => edgesMap.delete(edge.id))
            }
            break
          default:
            nodesMap.set(change.id, nextNodes.find((n) => n.id === change.id)!)
            break
        }
      }
    },
    [edgesMap, makeHelperLine, nodesMap],
  )

  // here we are observing the nodesMap and updating the nodes state whenever the map changes.
  useEffect(() => {
    const observer = () => {
      setNodes(Array.from(nodesMap.values()).sort(sortNode))
    }

    const appNodeIds = new Set(initialNodes.map((node) => node.id))
    initialNodes.forEach((node) => {
      nodesMap.set(node.id, { ...nodesMap.get(node.id), ...node })
    })
    for (const nodeId of nodesMap.keys()) {
      if (!appNodeIds.has(nodeId)) {
        nodesMap.delete(nodeId)
      }
    }

    setNodes(Array.from(nodesMap.values()).sort(sortNode))
    nodesMap.observe(observer)

    return () => {
      nodesMap.unobserve(observer)
    }
  }, [initialNodes, nodesMap])

  return [nodes, setNodesSynced, onNodesChanges, horizontalLine, verticalLine]
}
