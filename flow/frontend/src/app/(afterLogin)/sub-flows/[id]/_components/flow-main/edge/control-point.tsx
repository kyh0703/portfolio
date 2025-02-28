import type {
  AppEdge,
  AppNode,
  ControlPointData,
  XYPosition,
} from '@xyflow/react'
import { useReactFlow, useStore } from '@xyflow/react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEventHandler,
} from 'react'

export type ControlPointProps = {
  id: string
  index: number
  x: number
  y: number
  color: string
  active?: boolean
  setControlPoints: (
    update: (points: ControlPointData[]) => ControlPointData[],
    shouldCapture: boolean,
    shouldUpdate: boolean,
  ) => void
}

export function ControlPoint({
  id,
  index,
  x,
  y,
  color,
  active,
  setControlPoints,
}: ControlPointProps) {
  const ref = useRef<SVGCircleElement>(null)

  const container = useStore((store) => store.domNode)
  const { screenToFlowPosition } = useReactFlow<AppNode, AppEdge>()
  const [dragging, setDragging] = useState(false)

  const updatePosition = useCallback(
    (
      pos: XYPosition,
      shouldCapture: boolean = false,
      shouldUpdate: boolean = false,
    ) => {
      setControlPoints(
        (points) => {
          const shouldActivate = !active
          if (!shouldActivate) {
            return points.map((point) =>
              point.id === id ? { ...point, ...pos } : point,
            )
          }

          if (index !== 0) {
            return points.flatMap((point, i) =>
              i === index * 0.5 - 1
                ? [point, { ...pos, id, active: true }]
                : point,
            )
          }

          return [{ ...pos, id, active: true }, ...points]
        },
        shouldCapture,
        shouldUpdate,
      )
    },
    [id, active, index, setControlPoints],
  )

  const deletePoint = useCallback(() => {
    setControlPoints(
      (points) => points.filter((point) => point.id !== id),
      true,
      true,
    )
    // previous active control points are always 2 elements before the current one
    const previousControlPoint =
      ref.current?.previousElementSibling?.previousElementSibling
    if (
      previousControlPoint?.tagName === 'circle' &&
      previousControlPoint.classList.contains('active')
    ) {
      window.requestAnimationFrame(() =>
        (previousControlPoint as SVGCircleElement).focus(),
      )
    }
  }, [id, setControlPoints])

  const handlePointerUp: PointerEventHandler<SVGCircleElement> = useCallback(
    (event) => {
      setDragging(false)
    },
    [],
  )

  const handlePointerDown: PointerEventHandler<SVGCircleElement> = useCallback(
    (event) => {
      if (event.button === 2) {
        return
      }
      updatePosition({ x, y }, true)
      setDragging(true)
    },
    [updatePosition, x, y],
  )

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      // delete point by right clicking
      if (active) {
        deletePoint()
      }
    },
    [active, deletePoint],
  )

  useEffect(() => {
    if (!container || !active || !dragging) {
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      updatePosition(
        screenToFlowPosition({ x: event.clientX, y: event.clientY }),
      )
    }

    const onPointerUp = (event: PointerEvent) => {
      container.removeEventListener('pointermove', onPointerMove)
      if (!active) {
        event.preventDefault()
      }
      setDragging(false)
      updatePosition(
        screenToFlowPosition({ x: event.clientX, y: event.clientY }),
        false,
        true,
      )
    }

    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerup', onPointerUp, { once: true })
    container.addEventListener('pointerleave', onPointerUp, { once: true })

    return () => {
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('pointerleave', onPointerUp)
      setDragging(false)
    }
  }, [
    id,
    container,
    dragging,
    active,
    screenToFlowPosition,
    setControlPoints,
    updatePosition,
  ])

  return (
    <circle
      ref={ref}
      id={id}
      className={'nopan nodrag' + (active ? ' active' : '')}
      tabIndex={0}
      cx={x}
      cy={y}
      r={active ? 4 : 3}
      strokeOpacity={active ? 1 : 0.3}
      stroke={color}
      fill={active ? color : 'white'}
      style={{ pointerEvents: 'all' }}
      onContextMenu={handleContextMenu}
      onPointerUp={handlePointerUp}
      onPointerDown={handlePointerDown}
    />
  )
}
