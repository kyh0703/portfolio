import { Edge as ModelEdge } from '@/models/edge'
import { Node as ModelNode } from '@/models/node'
import {
  type AppEdge,
  type AppNode,
  type ControlPointData,
  type CustomEdgeType,
  type CustomNodeType,
  type MarkerType,
} from '@xyflow/react'
import { v4 as uuidv4 } from 'uuid'

const toModelNode = (node: AppNode): ModelNode => {
  return {
    id: node.data.databaseId!,
    subFlowId: node.data.subFlowId!,
    kind: node.type as CustomNodeType,
    nodeId: node.id!,
    groupId: node.parentId ?? '',
    pos: {
      x: node.position.x,
      y: node.position.y,
    },
    label: node.data?.label!,
    style: {
      bgColor: node.data.style?.backgroundColor ?? '',
      borderColor: node.data.style?.borderColor ?? '',
      borderStyle: node.data.style?.borderStyle ?? '',
      color: node.data.style?.color ?? '',
      width: node.width ?? 0,
      height: node.height ?? 0,
      hidden: node.hidden ?? false,
    },
    group: {
      collapsed: node.data.group?.collapsed ?? false,
      width: node.data.group?.width ?? 0,
      height: node.data.group?.height ?? 0,
    },
    desc: node.data?.desc!,
  }
}

const toModelEdge = (edge: AppEdge): ModelEdge => {
  const modelEdge: ModelEdge = {
    id: edge.data!.databaseId!,
    subFlowId: edge.data!.subFlowId!,
    kind: edge.type as CustomEdgeType,
    edgeId: edge.id,
    srcNodeId: edge.source,
    dstNodeId: edge.target,
    cond: edge.data!.condition!,
    points: edge.data!.points!,
    hidden: edge.hidden ?? false,
  }

  if (edge.markerEnd && typeof edge.markerEnd === 'object') {
    modelEdge.markerEnd = {
      width: edge.markerEnd.width!,
      height: edge.markerEnd.height!,
      type: edge.markerEnd.type!,
      color: edge.markerEnd.color!,
    }
  }

  return modelEdge
}

const toAppNode = (node: ModelNode): AppNode => {
  return {
    id: node.nodeId,
    type: node.kind as CustomNodeType,
    position: {
      x: node.pos.x,
      y: node.pos.y,
    },
    zIndex: node.kind === 'Memo' ? -1 : 0,
    parentId: node.groupId,
    extent: node.groupId ? 'parent' : undefined,
    expandParent: node.groupId ? true : undefined,
    data: {
      label: node.label,
      style: {
        backgroundColor: node.style.bgColor,
        borderColor: node.style.borderColor,
        borderStyle: node.style.borderStyle,
        color: node.style.color,
      },
      group: {
        collapsed: node.group?.collapsed ?? false,
        width: node.group?.width ?? 0,
        height: node.group?.height ?? 0,
      },
      subFlowId: node.subFlowId,
      databaseId: node.id,
      desc: node.desc,
    },
    width: node.style.width,
    height: node.style.height,
    hidden: node.style.hidden,
  }
}

const toAppEdge = (edge: ModelEdge): AppEdge => {
  return {
    id: edge.edgeId,
    type: edge.kind as CustomEdgeType,
    source: edge.srcNodeId,
    target: edge.dstNodeId,
    zIndex: 10,
    hidden: edge.hidden,
    data: {
      subFlowId: edge.subFlowId,
      databaseId: edge.id!,
      condition: edge.cond,
      points: edge.points,
    },
    markerEnd: {
      width: edge.markerEnd?.width,
      height: edge.markerEnd?.height,
      type: edge.markerEnd?.type as MarkerType,
      color: edge.markerEnd?.color,
    },
  }
}

const toPoints = (ghostNodes?: AppNode[]): ControlPointData[] => {
  return (
    ghostNodes?.map((node) => ({
      id: uuidv4(),
      x: node.position.x,
      y: node.position.y,
      active: true,
    })) ?? []
  )
}

export { toAppEdge, toAppNode, toModelEdge, toModelNode, toPoints }
