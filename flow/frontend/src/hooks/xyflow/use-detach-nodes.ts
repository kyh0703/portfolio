import { useYjs } from '@/contexts/yjs-context'
import { useRemoveNode, useUpdateNodes } from '@/services/subflow'
import { sortNode } from '@/utils'
import logger from '@/utils/logger'
import {
  useReactFlow,
  useStoreApi,
  type AppEdge,
  type AppNode,
} from '@xyflow/react'
import { useCallback } from 'react'
import { useUndoRedo } from '.'
import useYjsData from '../use-yjs-data'

export function useDetachNodes(subFlowId: number) {
  const { ydoc } = useYjs()
  const { sharedNodePropertiesMap } = useYjsData(ydoc)
  const { saveHistory, syncSaveHistory } = useUndoRedo(subFlowId)
  const { getNode, setNodes } = useReactFlow<AppNode, AppEdge>()
  const store = useStoreApi<AppNode, AppEdge>()
  const { mutateAsync: updateNodesMutate } = useUpdateNodes()
  const { mutateAsync: removeNodeMutate } = useRemoveNode()

  const detachNodes = useCallback(
    async (ids: string[], removeParentId?: string) => {
      const { nodeLookup } = store.getState()
      const updateNodes: AppNode[] = []
      const nextNodes = Array.from(nodeLookup.values())
        .map((node) => {
          if (!ids.includes(node.id) || !node.parentId) {
            return node
          }
          // 그룹의 계층구조에서 detach할 경우 한 계층 밖의 그룹 노드에 소속된다.
          const parentNode = nodeLookup.get(node.parentId)
          const updateNode = parentNode?.parentId
            ? {
                ...node,
                position: {
                  x: node.position.x + (parentNode?.position?.x ?? 0),
                  y: node.position.y + (parentNode?.position?.y ?? 0),
                },
                parentId: parentNode.parentId,
              }
            : {
                ...node,
                position: {
                  x: node.position.x + (parentNode?.position?.x ?? 0),
                  y: node.position.y + (parentNode?.position?.y ?? 0),
                },
                expandParent: undefined,
                parentId: '',
              }
          updateNodes.push(updateNode)
          return updateNode
        })
        .filter((n) => !removeParentId || n.id !== removeParentId)

      // removeParentId가 있으면 unGroup이다.
      // unGroup은 그룹노드를 삭제해준다.
      if (removeParentId) {
        const parent = getNode(removeParentId)!
        try {
          await syncSaveHistory('delete', [parent], [])
          await removeNodeMutate({ nodeId: parent.data.databaseId! })
          sharedNodePropertiesMap.delete('' + parent.data.databaseId!)
        } catch (error) {
          logger.error('failed to delete node', error)
          return
        }
      }

      try {
        await updateNodesMutate({ nodes: updateNodes })
        saveHistory('update', updateNodes, [])
        setNodes(nextNodes.sort(sortNode))
      } catch (error) {
        logger.error('failed to update node', error)
        return
      }
    },
    [
      getNode,
      removeNodeMutate,
      saveHistory,
      setNodes,
      sharedNodePropertiesMap,
      store,
      syncSaveHistory,
      updateNodesMutate,
    ],
  )

  return detachNodes
}
