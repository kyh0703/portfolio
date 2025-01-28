import {
  Box,
  type AppNode,
  type Node,
  type NodeOrigin,
  type Rect,
} from '@xyflow/react'
import { boxToRect, getNodePositionWithOrigin, rectToBox } from '@xyflow/system'

export const sortNode = (a: AppNode, b: AppNode): number => {
  if (a.type === 'Group' && !a.parentId && b.type === 'Group' && b.parentId) {
    return -1
  }
  if (a.type === 'Group' && a.parentId && b.type === 'Group' && !b.parentId) {
    return 1
  }

  if (a.parentId === b.id) {
    return 1
  }
  if (b.parentId === a.id) {
    return -1
  }

  if (a.type === 'Group' && b.type !== 'Group') {
    return -1
  }
  if (a.type !== 'Group' && b.type === 'Group') {
    return 1
  }

  if (a.parentId && !b.parentId) {
    return -1
  }
  if (b.parentId && !a.parentId) {
    return 1
  }

  return 0
}

export const getNodePositionInsideParent = (
  node: Partial<Node>,
  groupNodes: Node[],
) => {
  const targetNode = groupNodes[groupNodes.length - 1]
  const position = node.position ?? { x: 0, y: 0 }
  const [nodeWidth, nodeHeight] = [node.width ?? 0, node.height ?? 0]
  const [groupWidth, groupHeight] = [
    targetNode.width ?? 0,
    targetNode.height ?? 0,
  ]
  const { groupX, groupY } = groupNodes.reduce(
    (acc, curr) => {
      acc.groupX += curr.position.x
      acc.groupY += curr.position.y
      return acc
    },
    { groupX: 0, groupY: 0 },
  )

  if (position.x < groupX) {
    position.x = 0
  } else if (position.x + nodeWidth > groupX + groupWidth) {
    position.x = groupWidth - nodeWidth
  } else {
    position.x = position.x - groupX
  }

  if (position.y < groupY) {
    position.y = 0
  } else if (position.y + nodeHeight > groupY + groupHeight) {
    position.y = groupHeight - nodeHeight
  } else {
    position.y = position.y - groupY
  }

  return position
}

export const getBoundsOfBoxes = (box1: Box, box2: Box): Box => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2),
})

export const getRelativeNodesBounds = (
  nodes: Node[],
  nodeOrigin: NodeOrigin = [0, 0],
): Rect => {
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }

  const box = nodes.reduce(
    (currBox, node) => {
      const { x, y } = getNodePositionWithOrigin(node, nodeOrigin)
      return getBoundsOfBoxes(
        currBox,
        rectToBox({
          x,
          y,
          width: node.width || 0,
          height: node.height || 0,
        }),
      )
    },
    { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity },
  )

  return boxToRect(box)
}

type IsEqualCompareObj = {
  minWidth: number
  minHeight: number
  hasChildNodes: boolean
}

export function isEqual(
  prev: IsEqualCompareObj,
  next: IsEqualCompareObj,
): boolean {
  return (
    prev.minWidth === next.minWidth &&
    prev.minHeight === next.minHeight &&
    prev.hasChildNodes === next.hasChildNodes
  )
}
