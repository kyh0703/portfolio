import {
  DEFAULT_COMMAND_NODE_HEIGHT,
  DEFAULT_COMMAND_NODE_WIDTH,
} from '@/constants/xyflow'
import {
  useReactFlow,
  type AppEdge,
  type AppNode,
  type CustomNodeType,
  type XYPosition,
} from '@xyflow/react'
import { useCallback } from 'react'
import { useId } from '.'

export function useNodes() {
  const { getNode, getNodes, setNodes, getEdges, setCenter } = useReactFlow<
    AppNode,
    AppEdge
  >()
  const { issueNodeId } = useId()

  const nodeFactory = useCallback(
    (flowId: number, position: XYPosition, type: CustomNodeType) => {
      const newNode: AppNode = {
        id: issueNodeId(type),
        type,
        position,
        zIndex: 0,
        data: {
          flowId,
          databaseId: 0,
          label: '',
          style: {
            backgroundColor: '',
            borderColor: '',
            borderStyle: '',
            color: '',
          },
          desc: '',
        },
      }

      switch (type) {
        default:
          newNode.width = DEFAULT_COMMAND_NODE_WIDTH
          newNode.height = DEFAULT_COMMAND_NODE_HEIGHT
          break
      }

      return newNode
    },
    [issueNodeId],
  )

  const getNodeType = useCallback(
    (id: string) => {
      const node = getNode(id)
      return node?.type
    },
    [getNode],
  )

  const getAllSourceNodes = useCallback(
    (sourceNodes: AppNode[]) => {
      const findAllSourceNodes = (
        currentNodeId: string,
        visited = new Set<string>(),
      ) => {
        if (visited.has(currentNodeId)) {
          return []
        }

        visited.add(currentNodeId)

        const directSourceIds = getEdges()
          .filter((edge) => edge.target === currentNodeId)
          .map((edge) => edge.source)

        const allSources: string[] = []
        directSourceIds.forEach((sourceId) => {
          allSources.push(sourceId)
          allSources.push(...findAllSourceNodes(sourceId, visited))
        })

        return allSources
      }

      const sourceNodeIds: string[] = []
      for (const node of sourceNodes) {
        const nodes = findAllSourceNodes(node.id)
        sourceNodeIds.push(...nodes)
      }
      return sourceNodeIds
    },
    [getEdges],
  )

  const getAllTargetNodes = useCallback(
    (targetNodes: AppNode[]) => {
      const findAllTargetNodes = (
        currentNodeId: string,
        visited = new Set<string>(),
      ) => {
        if (visited.has(currentNodeId)) {
          return []
        }

        visited.add(currentNodeId)

        const directTargetIds = getEdges()
          .filter((edge) => edge.source === currentNodeId)
          .map((edge) => edge.target)

        const allTargets: string[] = []
        directTargetIds.forEach((targetId) => {
          allTargets.push(targetId)
          allTargets.push(...findAllTargetNodes(targetId, visited))
        })

        return allTargets
      }

      const targetNodeIds: string[] = []
      for (const node of targetNodes) {
        const nodes = findAllTargetNodes(node.id)
        targetNodeIds.push(...nodes)
      }
      return targetNodeIds
    },
    [getEdges],
  )

  const getSelectedNodes = useCallback(() => {
    return getNodes().reduce((acc, node) => {
      if (node.selected) {
        acc.push(node)
      }
      return acc
    }, [] as AppNode[])
  }, [getNodes])

  const setLabel = useCallback(
    (id: string, label: string) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: { ...node.data, label },
              }
            : node,
        ),
      )
    },
    [setNodes],
  )

  const setNodeStyle = useCallback(
    (id: string, styleProp: string, value: string | number) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  style: { ...node.data.style, [styleProp]: value },
                },
              }
            : node,
        ),
      )
    },
    [setNodes],
  )

  const focusingNode = useCallback(
    (nodeId: string, zoom: number = 1.85, duration: number = 1000) => {
      const node = getNode(nodeId)
      if (!node) {
        return
      }

      let [x, y] = [0, 0]
      x = node.position.x + node.width! / 2
      y = node.position.y + node.height! / 2
      setCenter(x, y, { zoom, duration })
    },
    [getNode, setCenter],
  )

  return {
    nodeFactory,
    getNodeType,
    getAllSourceNodes,
    getAllTargetNodes,
    getSelectedNodes,
    setLabel,
    setNodeStyle,
    focusingNode,
  }
}
