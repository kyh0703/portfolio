import { hasPropertyNode } from '@/app/(afterLogin)/sub-flows/[id]/_components/flow-main/tools'
import { useYjs } from '@/contexts/yjs-context'
import {
  getClipboard,
  useAddEdges,
  useAddNodes,
  useRemoveEdges,
  useRemoveNodes,
  useUpdateNodeProperty,
} from '@/services/subflow'
import { useAddClipboard } from '@/services/subflow/mutations/use-add-clipboard'
import { useUserContext } from '@/store/context'
import { toAppEdge, toAppNode } from '@/utils'
import logger from '@/utils/logger'
import {
  XYPosition,
  useReactFlow,
  useStore,
  type AppEdge,
  type AppNode,
  type CustomNodeType,
} from '@xyflow/react'
import { useCallback, useEffect, useRef } from 'react'
import { useEdges, useId, useNodes, useUndoRedo } from '.'
import useYjsData from '../use-yjs-data'

export function useCopyPaste(subFlowId: number) {
  const mousePosRef = useRef<XYPosition>({ x: 0, y: 0 })
  const isProcessingRef = useRef(false)
  const rfDomNode = useStore((state) => state.domNode)

  const { ydoc } = useYjs()
  const { sharedNodePropertiesMap } = useYjsData(ydoc)
  const { localIp, mode: flowMode } = useUserContext()
  const { getNodeMaxCount, issueEdgeId } = useId()
  const { getNodes, setNodes, setEdges, screenToFlowPosition, deleteElements } =
    useReactFlow<AppNode, AppEdge>()
  const { getSelectedNodes } = useNodes()
  const { getSelectedEdges } = useEdges()
  const { saveHistory, syncSaveHistory } = useUndoRedo(subFlowId)

  const { mutateAsync: addClipboardMutate } = useAddClipboard()
  const { mutateAsync: addNodesMutate } = useAddNodes()
  const { mutateAsync: addEdgesMutate } = useAddEdges()
  const { mutateAsync: updateNodePropertyMutate } = useUpdateNodeProperty()
  const { mutateAsync: removeNodesMutate } = useRemoveNodes()
  const { mutateAsync: removeEdgesMutate } = useRemoveEdges()

  // initialize the copy/paste hook
  // 1. remove native copy/paste/cut handlers
  // 2. add mouse move handler to keep track of the current mouse position
  useEffect(() => {
    const events = ['cut', 'copy', 'paste']

    if (!rfDomNode) {
      return
    }
    const preventDefault = (e: Event) => e.preventDefault()

    const onMouseMove = (event: MouseEvent) => {
      mousePosRef.current = {
        x: event.clientX,
        y: event.clientY,
      }
    }

    for (const event of events) {
      rfDomNode.addEventListener(event, preventDefault)
    }
    rfDomNode.addEventListener('mousemove', onMouseMove)

    return () => {
      for (const event of events) {
        rfDomNode.removeEventListener(event, preventDefault)
      }
      rfDomNode.removeEventListener('mousemove', onMouseMove)
    }
  }, [rfDomNode])

  const getPastePositionXY = useCallback((bufferedNodes: AppNode[]) => {
    const minX: number[] = []
    const minY: number[] = []

    bufferedNodes.forEach((bufferNode) => {
      switch (bufferNode.type) {
        case 'Group':
          if (!bufferNode.parentId) {
            minX.push(bufferNode.position.x)
            minY.push(bufferNode.position.y)
          }
          break
        default:
          if (!bufferedNodes.some((node) => node.id === node.parentId)) {
            minX.push(bufferNode.position.x)
            minY.push(bufferNode.position.y)
          }
          break
      }
    })

    return [Math.min(...minX), Math.min(...minY)]
  }, [])

  const canCopy = useCallback(() => {
    return getNodes().some((node) => node?.selected) || !isProcessingRef.current
  }, [getNodes])

  const copy = useCallback(async () => {
    if (isProcessingRef.current) {
      return
    }
    isProcessingRef.current = true

    const selectedNodes = getSelectedNodes()
    const selectedNodeIds = selectedNodes.map((node) => node.id)
    const selectedEdges = getSelectedEdges().filter(
      (edge) =>
        selectedNodeIds.includes(edge.source) &&
        selectedNodeIds.includes(edge.target),
    )
    if (selectedNodes.length === 0) {
      return
    }

    try {
      await addClipboardMutate({
        data: {
          ip: localIp,
          type: 'copy',
          nodes: selectedNodes.map((node) => ({
            id: node.data.databaseId!,
          })),
          edges: selectedEdges.map((edge) => ({
            id: edge.data?.databaseId!,
          })),
        },
      })
    } catch (error) {
      logger.error(error)
    } finally {
      isProcessingRef.current = false
    }
  }, [addClipboardMutate, getSelectedEdges, getSelectedNodes, localIp])

  const cut = useCallback(async () => {
    if (isProcessingRef.current) {
      return
    }
    isProcessingRef.current = true

    const selectedNodes = getSelectedNodes()
    const selectedNodeIds = selectedNodes.map((node) => node.id)
    const selectedEdges = getSelectedEdges().filter(
      (edge) =>
        selectedNodeIds.includes(edge.source) &&
        selectedNodeIds.includes(edge.target),
    )
    if (selectedNodes.length === 0) {
      return
    }

    try {
      await addClipboardMutate({
        data: {
          ip: localIp,
          type: 'cut',
          nodes: selectedNodes.map((node) => ({
            id: node.data.databaseId!,
          })),
          edges: selectedEdges.map((edge) => ({
            id: edge.data?.databaseId!,
          })),
        },
      })
      await syncSaveHistory('delete', selectedNodes, selectedEdges)
      await removeNodesMutate(
        selectedNodes.map((node) => ({ id: node.data.databaseId! })),
      )
      await removeEdgesMutate(
        selectedEdges.map((edge) => ({ id: edge.data!.databaseId! })),
      )
      selectedNodeIds.forEach((nodeId) =>
        sharedNodePropertiesMap.delete('' + nodeId),
      )
      deleteElements({ nodes: selectedNodes, edges: selectedEdges })
    } catch (error) {
      logger.error(error)
    } finally {
      isProcessingRef.current = false
    }
  }, [
    addClipboardMutate,
    deleteElements,
    getSelectedEdges,
    getSelectedNodes,
    localIp,
    removeEdgesMutate,
    removeNodesMutate,
    sharedNodePropertiesMap,
    syncSaveHistory,
  ])

  const canPaste = useCallback(() => {
    return !isProcessingRef.current
  }, [])

  const paste = useCallback(
    async (
      { x: pasteX, y: pasteY } = screenToFlowPosition({
        x: mousePosRef.current.x,
        y: mousePosRef.current.y,
      }),
    ) => {
      if (isProcessingRef.current) {
        return
      }
      isProcessingRef.current = true

      const response = await getClipboard(localIp)
      if (response.nodes.length === 0) {
        return
      }

      const [bufferedNodes, bufferedEdges] = [
        response.nodes.map((node) => toAppNode(node)),
        response.edges.map((edge) => toAppEdge(edge)),
      ]
      const [minX, minY] = getPastePositionXY(bufferedNodes)

      const nodeIdMap = new Map<string, string>() // NOTE: key: bufferNode.id, value: newNode.id
      const reversedNodeIdMap = new Map<string, string>() // NOTE: key: newNode.id, value: bufferNode.id
      const newNodeIdMap = new Map<CustomNodeType, number>() // NOTE: key: type, value: count

      const nextNodes = bufferedNodes.map((bufferNode: AppNode) => {
        const nodeType = bufferNode.type!
        const nodeId =
          newNodeIdMap.get(nodeType) || getNodeMaxCount(nodeType) + 1
        newNodeIdMap.set(nodeType, nodeId + 1)

        const bufferedParentNode = bufferedNodes.find(
          (node) => node.id === bufferNode.parentId,
        )
        const hasParentNode = bufferNode.parentId && bufferedParentNode

        const newNode: AppNode = {
          ...bufferNode,
          id: `${nodeType}-${nodeId}`,
          data: { ...bufferNode.data },
          position: hasParentNode
            ? { ...bufferNode.position }
            : {
                x: pasteX + (bufferNode.position.x - minX),
                y: pasteY + (bufferNode.position.y - minY),
              },
          width: bufferNode.width,
          height: bufferNode.height,
          parentId: hasParentNode
            ? nodeIdMap.get(bufferedParentNode.id)
            : undefined,
        }

        nodeIdMap.set(bufferNode.id, newNode.id)
        reversedNodeIdMap.set(newNode.id, bufferNode.id)
        return newNode
      })

      const nextEdges: AppEdge[] = bufferedEdges.map((edge) => ({
        ...edge,
        source: nodeIdMap.get(edge.source)!,
        target: nodeIdMap.get(edge.target)!,
        id: issueEdgeId(),
        data: { ...edge.data, points: [] },
      }))

      try {
        if (nextNodes.length > 0) {
          const ids = await addNodesMutate({ subFlowId, nodes: nextNodes })
          ids.forEach((node, index) => {
            nextNodes[index].data.databaseId = node.id
          })

          nextNodes.forEach(async (node) => {
            const bufferedNodeId = reversedNodeIdMap.get(node.id)
            const bufferedNode = response.nodes.find(
              (node) => node.nodeId === bufferedNodeId,
            )!
            if (hasPropertyNode(flowMode, bufferedNode.kind)) {
              await updateNodePropertyMutate({
                nodeId: node.data.databaseId!,
                nodeProperty: bufferedNode.property,
              })
            }
          })
        }

        if (nextEdges.length > 0) {
          const response = await addEdgesMutate({ subFlowId, edges: nextEdges })
          response.forEach((node, index) => {
            nextEdges[index].data!.databaseId = node.id
          })
        }
        saveHistory('create', nextNodes, nextEdges)
        setNodes((nodes) => [
          ...nodes.map((node) => ({ ...node, selected: false })),
          ...nextNodes,
        ])
        setEdges((edges) => [
          ...edges.map((edge) => ({ ...edge, selected: false })),
          ...nextEdges,
        ])
      } catch (error) {
        logger.error('Failed to paste', error)
      } finally {
        isProcessingRef.current = false
      }
    },
    [
      screenToFlowPosition,
      localIp,
      getPastePositionXY,
      getNodeMaxCount,
      issueEdgeId,
      saveHistory,
      setNodes,
      setEdges,
      addNodesMutate,
      subFlowId,
      flowMode,
      updateNodePropertyMutate,
      addEdgesMutate,
    ],
  )

  return { cut, canCopy, copy, canPaste, paste }
}
