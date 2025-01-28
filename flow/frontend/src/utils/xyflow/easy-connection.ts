import {
  DEFAULT_GHOST_NODE_HEIGHT,
  DEFAULT_GHOST_NODE_WIDTH,
} from '@/constants/xyflow'
import {
  MarkerType,
  Position,
  XYPosition,
  type ControlPointData,
  type Dimensions,
  type InternalNode,
} from '@xyflow/react'

export type CalculatePosition = XYPosition & Dimensions

export const toPositionByInternalNode = (
  node: InternalNode,
): CalculatePosition => ({
  height: node.measured.height!,
  width: node.measured.width!,
  x: node.internals.positionAbsolute.x,
  y: node.internals.positionAbsolute.y,
})

export const toPositionByControlPoint = (
  point: ControlPointData,
): CalculatePosition => ({
  height: DEFAULT_GHOST_NODE_HEIGHT,
  width: DEFAULT_GHOST_NODE_WIDTH,
  x: point.x,
  y: point.y,
})

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(
  source: CalculatePosition,
  target: CalculatePosition,
): XYPosition {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a

  // 소스 노드의 중심 좌표를 계산
  const sourceCenter = {
    x: source.x + source.width / 2,
    y: source.y + source.height / 2,
  }

  // 타겟 노드의 중심 좌표를 계산
  const targetCenter = {
    x: target.x + target.width / 2,
    y: target.y + target.height / 2,
  }

  // 소스와 타겟의 중심 간 x, y 방향 차이를 계산
  const dx = targetCenter.x - sourceCenter.x
  const dy = targetCenter.y - sourceCenter.y

  // dx와 dy의 절대값을 계산
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  // 초기 교차점 좌표는 소스의 중심
  let x = sourceCenter.x
  let y = sourceCenter.y

  // x 방향의 차이가 y 방향의 차이보다 큰 경우
  if (absDx > absDy) {
    const sign = dx > 0 ? 1 : -1 // dx의 부호에 따라 방향을 결정
    const ratio = dy / dx // y 변화량 대비 x 변화량의 비율을 계산
    x += (source.width / 2) * sign // x 좌표를 소스 너비의 절반만큼 이동
    y += (source.width / 2) * ratio * sign // y 좌표를 비율에 따라 이동
  } else {
    // y 방향의 차이가 더 큰 경우
    const sign = dy > 0 ? 1 : -1 // dy의 부호에 따라 방향을 결정
    const ratio = dx / dy // x 변화량 대비 y 변화량의 비율을 계산
    y += (source.height / 2) * sign // y 좌표를 소스 높이의 절반만큼 이동
    x += (source.height / 2) * ratio * sign // x 좌표도 비율에 따라 이동
  }

  return { x, y }
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node: CalculatePosition, point: XYPosition) {
  const nx = Math.round(node.x!)
  const ny = Math.round(node.y!)
  const px = Math.round(point.x)
  const py = Math.round(point.y)

  if (px <= nx + 1) {
    return Position.Left
  }
  if (px >= nx + node.width - 1) {
    return Position.Right
  }
  if (py <= ny + 1) {
    return Position.Top
  }
  if (py >= node.y + node.height - 1) {
    return Position.Bottom
  }

  return Position.Top
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(
  source: CalculatePosition,
  target: CalculatePosition,
) {
  const sourceIntersectionPoint = getNodeIntersection(source, target)
  const targetIntersectionPoint = getNodeIntersection(target, source)

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint)
  const targetPos = getEdgePosition(target, targetIntersectionPoint)

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  }
}

export function createNodesAndEdges() {
  const nodes = []
  const edges = []
  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

  nodes.push({ id: 'target', data: { label: 'Target' }, position: center })

  for (let i = 0; i < 8; i++) {
    const degrees = i * (360 / 8)
    const radians = degrees * (Math.PI / 180)
    const x = 250 * Math.cos(radians) + center.x
    const y = 250 * Math.sin(radians) + center.y

    nodes.push({ id: `${i}`, data: { label: 'Source' }, position: { x, y } })

    edges.push({
      id: `edge-${i}`,
      target: 'target',
      source: `${i}`,
      markerEnd: {
        type: MarkerType.Arrow,
      },
    })
  }

  return { nodes, edges }
}
