import {
  edgeMenuComponents,
  type EdgeMenuComponentKey,
} from '@/app/(afterLogin)/flow/[id]/_components/flow-main/edge/menu/types'
import { isValidConnection } from '@/app/(afterLogin)/flow/[id]/_components/flow-main/tools'
import {
  useAddEdge,
  useRemoveEdge,
  useRemoveEdges,
  useUpdateEdge,
} from '@/services/flow'
import { colors } from '@/themes'
import {
  MarkerType,
  reconnectEdge,
  useReactFlow,
  type AppEdge,
  type AppNode,
  type Connection,
  type ControlPointData,
  type CustomEdgeType,
  type EdgeMarker,
} from '@xyflow/react'
import {
  devWarn,
  errorMessages,
  isEdgeBase,
  type EdgeBase,
} from '@xyflow/system'
import { useCallback } from 'react'
import { useId } from '.'

export function useEdges() {
  const { getEdges, setEdges, deleteElements } = useReactFlow<
    AppNode,
    AppEdge
  >()
  const { issueEdgeId } = useId()

  const { mutateAsync: addEdgeMutate } = useAddEdge()
  const { mutateAsync: updateEdgeMutate } = useUpdateEdge()
  const { mutateAsync: removeEdgeMutate } = useRemoveEdge()
  const { mutateAsync: removeEdgesMutate } = useRemoveEdges()

  const hasCondition = useCallback((checkEdge: EdgeBase, edges: EdgeBase[]) => {
    return edges.some(
      (edge) =>
        edge.source === checkEdge.source &&
        edge.target === checkEdge.target &&
        edge.data!.condition === checkEdge.data!.condition &&
        (edge.sourceHandle === checkEdge.sourceHandle ||
          (!edge.sourceHandle && !checkEdge.sourceHandle)) &&
        (edge.targetHandle === checkEdge.targetHandle ||
          (!edge.targetHandle && !checkEdge.targetHandle)),
    )
  }, [])

  const addEdge = useCallback(
    <EdgeType extends EdgeBase>(
      edgeParams: EdgeType | Connection,
      edges: EdgeType[],
    ): EdgeType[] => {
      if (!edgeParams.source || !edgeParams.target) {
        devWarn('006', errorMessages['error006']())
        return edges
      }

      let edge: EdgeType
      if (isEdgeBase(edgeParams)) {
        edge = { ...edgeParams }
      } else {
        edge = {
          ...edgeParams,
          id: issueEdgeId(),
        } as EdgeType
      }

      if (hasCondition(edge, edges)) {
        return edges
      }

      if (edge.sourceHandle === null) {
        delete edge.sourceHandle
      }

      if (edge.targetHandle === null) {
        delete edge.targetHandle
      }

      return edges.concat(edge)
    },
    [issueEdgeId, hasCondition],
  )

  const setColor = useCallback((type: CustomEdgeType, condition?: string) => {
    if (condition === 'error') {
      return '#C7253E'
    }
    if (condition === 'timeout') {
      return '#9B5FFF'
    }

    switch (type) {
      case 'If':
        return condition === 'true' ? '#4DA6FF' : '#FF4D4D'
      case 'Select':
        return '#F95959'
      case 'GetDigit':
        return '#1E5AFF'
      case 'IntentCall':
        if (condition && !['next', 'nomatch'].includes(condition)) {
          return '#1EA046'
        }
      default:
        return colors.foreground
    }
  }, [])

  const setMarkerEnd = useCallback(
    (type: CustomEdgeType, condition?: string): EdgeMarker | undefined => {
      const markerEnd: EdgeMarker = {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: setColor(type, condition),
      }
      switch (type) {
        case 'If':
        case 'Select':
        case 'MenuCall':
        case 'GetDigit':
        case 'Play':
          return {
            ...markerEnd,
            color: setColor(type, condition),
          }
        case 'Memo':
          return undefined
        default:
          return markerEnd
      }
    },
    [setColor],
  )

  const copyEdge = (
    connection: Connection,
    type: CustomEdgeType,
    copyEdge: AppEdge,
    condition?: string,
  ): AppEdge => {
    return {
      ...copyEdge,
      ...connection,
      id: issueEdgeId(),
      type,
      data: {
        ...copyEdge.data,
        condition,
      },
      markerEnd: setMarkerEnd(type, condition),
      zIndex: 10,
    }
  }

  const edgeFactory = useCallback(
    (
      flowId: number,
      connection: Connection,
      type: CustomEdgeType,
      condition?: string,
      points: ControlPointData[] = [],
    ): AppEdge | undefined => {
      if (!isValidConnection(connection)) {
        return undefined
      }

      const edge: AppEdge = {
        ...connection,
        id: issueEdgeId(),
        type,
        data: {
          flowId,
          condition,
          points,
        },
        markerEnd: setMarkerEnd(type, condition),
        zIndex: 10,
        reconnectable: false,
      }

      switch (type) {
        case 'Ghost':
          edge.selectable = false
          edge.reconnectable = false
          break
      }

      return edge
    },
    [issueEdgeId, setMarkerEnd],
  )

  const addEdgeToDB = useCallback(
    async (flowId: number, edge: AppEdge) => {
      const response = await addEdgeMutate({ flowId, data: edge })
      edge.data!.databaseId = response.id
      setEdges((edges) => addEdge(edge, edges))
      return response.id
    },
    [addEdge, addEdgeMutate, setEdges],
  )

  const updateEdgeToDB = useCallback(
    async (edge: AppEdge) => {
      await updateEdgeMutate({
        edgeId: edge.data!.databaseId!,
        edge: { ...edge },
      })
    },
    [updateEdgeMutate],
  )

  const updateEdgeConnectionToDB = useCallback(
    async (edge: AppEdge, connection: Connection) => {
      await updateEdgeMutate({
        edgeId: edge.data!.databaseId!,
        edge: {
          ...edge,
          source: connection.source!,
          target: connection.target!,
          sourceHandle: connection.sourceHandle!,
          targetHandle: connection.targetHandle!,
        },
      })
      setEdges((edges) =>
        reconnectEdge(edge, connection, edges, {
          shouldReplaceId: false,
        }),
      )
    },
    [setEdges, updateEdgeMutate],
  )

  const removeEdgeToDB = useCallback(
    async (edge: AppEdge) => {
      await removeEdgeMutate({ edgeId: edge.data!.databaseId! })
      deleteElements({ edges: [edge] })
    },
    [deleteElements, removeEdgeMutate],
  )

  const removeEdgesToDB = useCallback(
    async (edges: AppEdge[]) => {
      await removeEdgesMutate(
        edges.map((edge) => ({
          id: edge.data!.databaseId!,
        })),
      )
      deleteElements({ edges: edges })
    },
    [deleteElements, removeEdgesMutate],
  )

  const isMenuEdge = useCallback((type: CustomEdgeType) => {
    const edgeKeys = Object.keys(edgeMenuComponents) as EdgeMenuComponentKey[]
    return edgeKeys.includes(type as EdgeMenuComponentKey)
  }, [])

  const getSelectedEdges = useCallback(() => {
    return getEdges().filter((edge) => edge.selected)
  }, [getEdges])

  const getSelectedEdgesByNodes = useCallback(
    (selectedNodes: AppNode[]) => {
      return getEdges().filter((edge) => {
        return (
          selectedNodes.some(
            (node) => node.id === edge.source || node.id === edge.target,
          ) || edge.selected
        )
      })
    },
    [getEdges],
  )

  const getEdgeBySource = useCallback(
    (id: string) =>
      getEdges().find(
        (edge) => edge.source === id && !edge.target.includes('Ghost'),
      ),
    [getEdges],
  )

  const getEdgesBySource = useCallback(
    (id: string) =>
      getEdges().filter(
        (edge) => edge.source === id && !edge.target.includes('Ghost'),
      ),
    [getEdges],
  )

  const getEdgeByTarget = useCallback(
    (id: string) => getEdges().find((edge) => edge.source === id),
    [getEdges],
  )

  const getEdgesByTarget = useCallback(
    (id: string) => getEdges().filter((edge) => edge.target === id),
    [getEdges],
  )

  const setAnimated = useCallback(
    (id: string, animated: boolean) => {
      setEdges((edges) =>
        edges.map((edge) => (edge.id === id ? { ...edge, animated } : edge)),
      )
    },
    [setEdges],
  )

  return {
    setColor,
    edgeFactory,
    copyEdge,
    addEdgeToDB,
    updateEdgeToDB,
    updateEdgeConnectionToDB,
    removeEdgeToDB,
    removeEdgesToDB,
    isMenuEdge,
    getSelectedEdges,
    getSelectedEdgesByNodes,
    getEdgeBySource,
    getEdgesBySource,
    getEdgeByTarget,
    getEdgesByTarget,
    setAnimated,
  }
}
