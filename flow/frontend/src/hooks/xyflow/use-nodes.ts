import { hasParentNode } from '@/app/(afterLogin)/subflows/[id]/_components/flow-main/tools'
import {
  DEFAULT_COMMAND_NODE_HEIGHT,
  DEFAULT_COMMAND_NODE_WIDTH,
  DEFAULT_GHOST_NODE_HEIGHT,
  DEFAULT_GHOST_NODE_WIDTH,
  DEFAULT_GROUP_NODE_HEIGHT,
  DEFAULT_GROUP_NODE_WIDTH,
  DEFAULT_MEMO_NODE_HEIGHT,
  DEFAULT_MEMO_NODE_WIDTH,
} from '@/constants/xyflow'
import { getNodePositionInsideParent } from '@/utils/xyflow/dynamic-grouping'
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
    (subFlowId: number, position: XYPosition, type: CustomNodeType) => {
      let newNode: AppNode = {
        id: issueNodeId(type),
        type,
        position,
        zIndex: 0,
        data: {
          subFlowId,
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
        case 'Group':
          newNode.width = DEFAULT_GROUP_NODE_WIDTH
          newNode.height = DEFAULT_GROUP_NODE_HEIGHT
          break
        case 'Memo':
          newNode.zIndex = -1
          newNode.width = DEFAULT_MEMO_NODE_WIDTH
          newNode.height = DEFAULT_MEMO_NODE_HEIGHT
          break
        case 'Ghost':
          newNode.width = DEFAULT_GHOST_NODE_WIDTH
          newNode.height = DEFAULT_GHOST_NODE_HEIGHT
          newNode.selectable = false
          newNode.draggable = false
          break
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

  const getAllParentNodes = useCallback(
    (childNode: AppNode) => {
      const findAllParentNodes = (
        currentNodeId: string,
        parentNodes: AppNode[] = [],
      ): AppNode[] => {
        const parentNode = getNode(currentNodeId)
        if (!parentNode) {
          return parentNodes
        }

        parentNodes.push(parentNode)

        if (parentNode.parentId) {
          return findAllParentNodes(parentNode.parentId, parentNodes)
        }

        return parentNodes
      }

      if (!childNode.parentId) {
        return []
      }

      return findAllParentNodes(childNode.parentId)
    },
    [getNode],
  )

  const getAllChildNodes = useCallback(
    (parentNode: AppNode) => {
      const findAllChildNodes = (
        currentNodeId: string,
        visited = new Set<string>(),
      ) => {
        if (visited.has(currentNodeId)) {
          return []
        }

        visited.add(currentNodeId)

        const directChild = getNodes().filter(
          (node) => node.parentId === currentNodeId,
        )

        const allChild: AppNode[] = []
        directChild.forEach((node) => {
          allChild.push(node)
          allChild.push(...findAllChildNodes(node.id, visited))
        })

        return allChild
      }

      return findAllChildNodes(parentNode.id)
    },
    [getNodes],
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

      let sourceNodeIds: string[] = []
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

      let targetNodeIds: string[] = []
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
      if (node.type !== 'Start' && node.selected) {
        acc.push(node)
        if (node.type === 'Group') {
          acc.push(...getAllChildNodes(node))
        }
      }
      return acc
    }, [] as AppNode[])
  }, [getAllChildNodes, getNodes])

  const getGhostNodesBySource = useCallback(
    (source: string) => {
      const ghostEdges = getEdges().filter((edge) =>
        edge.target.includes('Ghost'),
      )
      if (ghostEdges.length === 0) {
        return []
      }

      const extractNodes: AppNode[] = []
      const findGhostNode = (source: string, visited = new Set<string>()) => {
        ghostEdges.forEach((edge) => {
          if (edge.source !== source) {
            return
          }

          const target = getNode(edge.target)
          if (target && !visited.has(target.id)) {
            visited.add(target.id)
            extractNodes.push(target)
            findGhostNode(target.id, visited)
          }
        })
      }

      findGhostNode(source)
      return extractNodes
    },
    [getEdges, getNode],
  )

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

  const setDescription = useCallback(
    (id: string, desc: string) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: { ...node.data, desc },
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
      if (!node.parentId) {
        x = node.position.x + node.width! / 2
        y = node.position.y + node.height! / 2
      } else {
        const parentNodes = getAllParentNodes(node)
        parentNodes.forEach((parentNode) => {
          x += parentNode.position.x
          y += parentNode.position.y
        })
        x += node.position.x + node.width! / 2
        y += node.position.y + node.height! / 2
      }

      setCenter(x, y, { zoom, duration })
    },
    [getAllParentNodes, getNode, setCenter],
  )

  return {
    nodeFactory,
    getNodeType,
    getAllParentNodes,
    getAllChildNodes,
    getAllSourceNodes,
    getAllTargetNodes,
    getSelectedNodes,
    getGhostNodesBySource,
    setLabel,
    setDescription,
    setNodeStyle,
    focusingNode,
  }
}
