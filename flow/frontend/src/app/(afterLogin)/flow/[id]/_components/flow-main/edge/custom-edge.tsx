import { useEdges, useUndoRedo } from '@/hooks/xyflow'
import { useUpdateEdge } from '@/services/flow'
import { colors } from '@/themes'
import { toPositionByInternalNode } from '@/utils'
import {
  BaseEdge,
  EdgeLabelRenderer,
  useInternalNode,
  useReactFlow,
  useStoreApi,
  type AppEdge,
  type AppNode,
  type ControlPointData,
  type CustomEdgeProps,
} from '@xyflow/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ControlPoint } from './control-point'
import { getControlPoints, getLabelXY, getPath } from './path'
import { getPathPoint } from './path/utils'

export function CustomEdge({
  id,
  selected,
  source,
  sourceX,
  sourceY,
  sourcePosition,
  target,
  targetX,
  targetY,
  targetPosition,
  markerStart,
  markerEnd,
  style,
  data,
  ...props
}: CustomEdgeProps) {
  const store = useStoreApi<AppNode, AppEdge>()
  const { flowId, databaseId } = data!
  const { setEdges } = useReactFlow<AppNode, AppEdge>()
  const { setColor } = useEdges()
  const shouldCaptureEdge = useRef<{
    origin: AppEdge | null
    update: AppEdge | null
  }>({
    origin: null,
    update: null,
  })

  const [shouldMutationTrigger, setShouldMutationTrigger] = useState(true)
  const updateEdgeMutation = useUpdateEdge()
  const { saveHistory } = useUndoRedo(flowId!)

  const sourceNode = useInternalNode(source)!
  const targetNode = useInternalNode(target)!
  const points = useMemo(() => data?.points ?? [], [data?.points])

  const isGhostNode = sourceNode.type === 'Ghost' || targetNode.type === 'Ghost'
  const color = isGhostNode
    ? colors.foreground
    : setColor(sourceNode.type, data?.condition)

  const positions: any[] = [
    toPositionByInternalNode(sourceNode),
    ...points,
    toPositionByInternalNode(targetNode),
  ]

  const pathPoints = getPathPoint(positions)
  const controlPoints = getControlPoints(pathPoints)
  const path = getPath(pathPoints)
  const labelXY = getLabelXY(pathPoints)

  const setControlPoints = useCallback(
    (
      update: (points: ControlPointData[]) => ControlPointData[],
      shouldCapture: boolean,
      shouldUpdated: boolean,
    ) => {
      const { edgeLookup } = store.getState()
      let originEdge: AppEdge | null = null
      let updateEdge: AppEdge | null = null
      const nextEdges = Array.from(edgeLookup.values()).map((edge) => {
        if (edge.id === id) {
          originEdge = { ...edge }
          const points = edge.data?.points ?? []
          const data = {
            ...edge.data,
            points: update(points),
          }
          updateEdge = { ...edge, data }
          return updateEdge
        }
        return edge
      })

      setEdges(nextEdges)
      if (shouldCapture) {
        shouldCaptureEdge.current = {
          ...shouldCaptureEdge.current,
          origin: originEdge,
        }
      }
      if (shouldUpdated) {
        shouldCaptureEdge.current = {
          ...shouldCaptureEdge.current,
          update: updateEdge,
        }
        setShouldMutationTrigger(true)
      }
    },
    [id, setEdges, store],
  )

  useEffect(() => {
    if (shouldMutationTrigger) {
      if (shouldCaptureEdge.current.origin) {
        saveHistory('update', [], [shouldCaptureEdge.current.origin])
      }
      if (shouldCaptureEdge.current.update) {
        updateEdgeMutation.mutate({
          edgeId: databaseId!,
          edge: shouldCaptureEdge.current.update,
        })
      }
      shouldCaptureEdge.current = {
        origin: null,
        update: null,
      }
      setShouldMutationTrigger(false)
    }
  }, [shouldMutationTrigger, databaseId, saveHistory, updateEdgeMutation])

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        {...props}
        markerStart={markerStart}
        markerEnd={!isGhostNode ? markerEnd : undefined}
        style={{
          ...style,
          stroke: color,
          strokeWidth: 1,
          strokeDasharray: selected ? '5,5' : '0',
        }}
      />
      {!isGhostNode && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelXY.x}px,${labelXY.y}px)`,
              color: color,
            }}
            className="nodrag nopan absolute z-0 bg-transparent p-[5px] text-bs font-bold"
          >
            {data?.condition}
          </div>
        </EdgeLabelRenderer>
      )}
      {selected &&
        controlPoints.map((point, index) => (
          <ControlPoint
            key={point.id}
            index={index}
            color={color}
            setControlPoints={setControlPoints}
            {...point}
          />
        ))}
    </>
  )
}
