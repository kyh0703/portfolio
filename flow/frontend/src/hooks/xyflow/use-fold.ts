import {
  CHILD_PADDING,
  DEFAULT_GROUP_NODE_FOLD_HEIGHT,
  DEFAULT_GROUP_NODE_FOLD_WIDTH,
} from '@/constants/xyflow'
import {
  useAddEdges,
  useRemoveEdges,
  useUpdateEdges,
  useUpdateNodes,
} from '@/services/flow'
import logger from '@/utils/logger'
import {
  useReactFlow,
  useStoreApi,
  type AppEdge,
  type AppNode,
} from '@xyflow/react'
import { useCallback } from 'react'
import { useEdges, useNodes } from '.'

export function useFold(subFlowId: number) {
  const store = useStoreApi<AppNode, AppEdge>()
  const { setNodes, setEdges, getIntersectingNodes } = useReactFlow<
    AppNode,
    AppEdge
  >()
  const { copyEdge } = useEdges()
  const { getAllTargetNodes } = useNodes()

  const { mutateAsync: addEdgesMutate } = useAddEdges()
  const { mutateAsync: updateNodesMutate } = useUpdateNodes()
  const { mutateAsync: updateEdgesMutate } = useUpdateEdges()
  const { mutateAsync: removeEdgesMutate } = useRemoveEdges()

  const fold = useCallback(
    async (parentNode: AppNode, childNodes: AppNode[]) => {
      const { nodeLookup, edgeLookup } = store.getState()

      const childNodeIds = childNodes.map((node) => node.id)
      const targetNodeIds = getAllTargetNodes(childNodes)

      console.log('childNodeIds', childNodeIds)
      const updateNodes: AppNode[] = []
      const nextNodes = Array.from(nodeLookup.values()).map((node) => {
        if (node.id === parentNode.id) {
          const parent: AppNode = {
            ...node,
            data: {
              ...node.data,
              group: {
                ...node.data.group,
                width: parentNode.width,
                height: parentNode.height,
                collapsed: true,
              },
            },
            width: DEFAULT_GROUP_NODE_FOLD_WIDTH,
            height: DEFAULT_GROUP_NODE_FOLD_WIDTH,
          }
          updateNodes.push(parent)
          return parent
        }

        if (childNodeIds.includes(node.id)) {
          const updateNode: AppNode = {
            ...node,
            hidden: true,
          }
          updateNodes.push(updateNode)
          return updateNode
        }

        if (targetNodeIds.includes(node.id)) {
          const dx = parentNode.width! - DEFAULT_GROUP_NODE_FOLD_WIDTH
          const dy = parentNode.height! - DEFAULT_GROUP_NODE_FOLD_HEIGHT

          let [x, y] = [0, 0]
          if (node.position.x > 0) {
            x = node.position.x - dx
          } else {
            x = node.position.x + dx * -1
          }
          if (node.position.y > 0) {
            y = node.position.y - dy
          } else {
            y = node.position.y + dy * -1
          }

          const moveNode: AppNode = {
            ...node,
            position: { x, y },
          }
          updateNodes.push(moveNode)
          return moveNode
        }

        return node
      })

      const updateEdges: AppEdge[] = []
      const nextEdges = Array.from(edgeLookup.values()).map((edge) => {
        if (
          childNodeIds.includes(edge.source) ||
          childNodeIds.includes(edge.target)
        ) {
          const updateEdge: AppEdge = {
            ...edge,
            hidden: true,
          }
          updateEdges.push(updateEdge)
          return updateEdge
        }

        return edge
      })

      const addEdges: AppEdge[] = []
      const newGroupSourceEdges: AppEdge[] = updateEdges.filter(
        (edge) => !childNodeIds.includes(edge.source),
      )
      newGroupSourceEdges.forEach((edge) => {
        const newEdge: AppEdge = copyEdge(
          {
            source: edge.source,
            target: parentNode.id,
            sourceHandle: null,
            targetHandle: null,
          },
          parentNode.type,
          edge,
          `${edge.source}>${edge.target}`,
        )
        newEdge.hidden = false
        newEdge.selectable = false
        newEdge.deletable = false
        nextEdges.push(newEdge)
        addEdges.push(newEdge)
      })

      const newGroupTargetEdges: AppEdge[] = updateEdges.filter(
        (edge) => !childNodeIds.includes(edge.target),
      )
      newGroupTargetEdges.forEach((edge) => {
        const newEdge: AppEdge = copyEdge(
          {
            source: parentNode.id,
            target: edge.target,
            sourceHandle: null,
            targetHandle: null,
          },
          parentNode.type,
          edge,
          `${edge.source}>${edge.target}`,
        )
        newEdge.hidden = false
        newEdge.selectable = false
        newEdge.deletable = false
        nextEdges.push(newEdge)
        addEdges.push(newEdge)
      })

      try {
        await updateNodesMutate({ nodes: updateNodes })
        await updateEdgesMutate({ edges: updateEdges })
        const response = await addEdgesMutate({ subFlowId, edges: addEdges })
        response.forEach((node, index) => {
          addEdges[index].data!.databaseId = node.id
        })

        setNodes(nextNodes)
        setEdges(nextEdges)
      } catch (error) {
        return
      }
    },
    [
      addEdgesMutate,
      copyEdge,
      getAllTargetNodes,
      setEdges,
      setNodes,
      store,
      subFlowId,
      updateEdgesMutate,
      updateNodesMutate,
    ],
  )

  const unfold = useCallback(
    async (parentNode: AppNode, childNodes: AppNode[]) => {
      const { nodeLookup, edgeLookup } = store.getState()
      const width = parentNode.data.group?.width!
      const height = parentNode.data.group?.height!

      const targetNodeIds = getAllTargetNodes(childNodes)
      const otherIntersectionNodes = getIntersectingNodes({
        x: parentNode.position.x,
        y: parentNode.position.y,
        width,
        height,
      }).filter(
        (node) =>
          node.parentId !== parentNode.id &&
          node.type !== 'Group' &&
          !targetNodeIds.includes(node.id),
      )
      const otherNodeIds = otherIntersectionNodes.map((node) => node.id)
      const childNodeIds = childNodes.map((node) => node.id)

      const updateNodes: AppNode[] = []
      const nextNodes = Array.from(nodeLookup.values()).map((node) => {
        if (node.id === parentNode.id) {
          const parentNode: AppNode = {
            ...node,
            data: {
              ...node.data,
              group: {
                width: 0,
                height: 0,
                collapsed: false,
              },
            },
            width,
            height,
          }
          updateNodes.push(parentNode)
          return parentNode
        }

        if (otherNodeIds.includes(node.id)) {
          const otherNode: AppNode = {
            ...node,
            position: {
              x: parentNode.position.x + width + CHILD_PADDING,
              y: parentNode.position.y + height + CHILD_PADDING,
            },
          }
          updateNodes.push(otherNode)
          return otherNode
        }

        if (childNodeIds.includes(node.id)) {
          const updateNode: AppNode = {
            ...node,
            hidden: false,
          }
          updateNodes.push(updateNode)
          return updateNode
        }

        if (targetNodeIds.includes(node.id)) {
          const dx = width - DEFAULT_GROUP_NODE_FOLD_WIDTH
          const dy = height - DEFAULT_GROUP_NODE_FOLD_HEIGHT

          let [x, y] = [0, 0]
          if (node.position.x > 0) {
            x = node.position.x + dx
          } else {
            x = node.position.x - dx * -1
          }

          if (node.position.y > 0) {
            y = node.position.y + dy
          } else {
            y = node.position.y - dy * -1
          }

          const moveNode: AppNode = {
            ...node,
            position: { x, y },
          }
          updateNodes.push(moveNode)
          return moveNode
        }

        return node
      })

      const updateEdges: AppEdge[] = []
      const nextEdges = Array.from(edgeLookup.values()).map((edge) => {
        if (
          childNodeIds.includes(edge.source) ||
          childNodeIds.includes(edge.target)
        ) {
          const updateEdge: AppEdge = {
            ...edge,
            hidden: false,
          }
          updateEdges.push(updateEdge)
          return updateEdge
        }
        return edge
      })

      const removeEdgeIds: { id: number }[] = []
      const filterNextEdges = nextEdges.filter((edge) => {
        if (edge.source === parentNode.id || edge.target === parentNode.id) {
          removeEdgeIds.push({ id: edge.data!.databaseId! })
          return false
        }
        return true
      })

      try {
        await updateNodesMutate({ nodes: updateNodes })
        await updateEdgesMutate({ edges: updateEdges })
        await removeEdgesMutate(removeEdgeIds)
        setNodes(nextNodes)
        setEdges(filterNextEdges)
      } catch (error) {
        logger.error('failed to update node', error)
        return
      }
    },
    [
      getAllTargetNodes,
      getIntersectingNodes,
      removeEdgesMutate,
      setEdges,
      setNodes,
      store,
      updateEdgesMutate,
      updateNodesMutate,
    ],
  )

  return { fold, unfold }
}
