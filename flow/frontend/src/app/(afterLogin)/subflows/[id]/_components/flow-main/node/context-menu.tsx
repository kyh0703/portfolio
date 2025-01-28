'use client'

import { FoldIcon, UnfoldIcon } from '@/app/_components/icon'
import { CHILD_PADDING } from '@/constants/xyflow'
import {
  useAlign,
  useDetachNodes,
  useNodes,
  useRemove,
  useUndoRedo,
} from '@/hooks/xyflow'
import { useFold } from '@/hooks/xyflow/use-fold'
import { useAddNode, useUpdateNodes } from '@/services/subflow'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { sortNode } from '@/utils'
import logger from '@/utils/logger'
import {
  getNodesBounds,
  useReactFlow,
  useStoreApi,
  type AppEdge,
  type AppNode,
} from '@xyflow/react'
import {
  AlignHorizontalSpaceAroundIcon,
  AlignVerticalSpaceAroundIcon,
  GroupIcon,
  SplitIcon,
  TrashIcon,
  UngroupIcon,
} from 'lucide-react'
import { useCallback } from 'react'
import ContextMenu from '../../../../../../_components/context-menu'

const icon = 12
const menuItemStyle = 'text-xs flex gap-3'

export type NodeContextMenuProps = {
  id: string
  mouse: {
    x: number
    y: number
  }
  onClick?: () => void
}

export function NodeContextMenu({ id, ...props }: NodeContextMenuProps) {
  const store = useStoreApi()
  const { getNode, getNodes, setNodes } = useReactFlow<AppNode, AppEdge>()

  const targetNode = getNode(id)!
  const subFlowId = targetNode.data.subFlowId!

  const { nodeFactory, getAllChildNodes } = useNodes()
  const { saveHistory } = useUndoRedo(subFlowId)
  const { removeNode } = useRemove(subFlowId)
  const { fold, unfold } = useFold(subFlowId)
  const { canAlign, align } = useAlign(subFlowId)
  const detachNodes = useDetachNodes(subFlowId)

  const childNodes = getNodes().filter((node) => node.parentId === id)
  const selectedNodes = getNodes().filter((node) => node.selected)
  const groupSelectedNodes = selectedNodes.filter(
    (node) => node.type !== 'Memo' && node.type !== 'Start' && !node.parentId,
  )
  const hasParent = !!targetNode?.parentId

  const hasChild = childNodes.length > 0
  const canGroup = groupSelectedNodes.length > 1
  const canUnGroup = !targetNode.data.group?.collapsed && hasChild
  const canFold = !targetNode.data.group?.collapsed && hasChild
  const canUnfold = !!targetNode.data.group?.collapsed && hasChild

  const { mutateAsync: addNodeMutate } = useAddNode()
  const { mutateAsync: updateNodesMutate } = useUpdateNodes()

  const handleDelete = useCallback(async () => {
    await removeNode(id)
  }, [removeNode, id])

  const handleDetach = useCallback(async () => {
    await detachNodes([id])
  }, [detachNodes, id])

  const handleGroup = async () => {
    const selectedNodeIds = groupSelectedNodes.map((node) => node.id)
    const rectOfNodes = getNodesBounds(groupSelectedNodes)
    const parentPosition = {
      x: rectOfNodes.x - CHILD_PADDING,
      y: rectOfNodes.y - CHILD_PADDING,
    }
    const groupNode = nodeFactory(subFlowId, parentPosition, 'Group')
    groupNode.width = rectOfNodes.width + CHILD_PADDING * 2
    groupNode.height = rectOfNodes.height + CHILD_PADDING * 2

    try {
      const response = await addNodeMutate({ subFlowId, node: groupNode })
      groupNode.data.databaseId = response.id
      saveHistory('create', [groupNode], [])
    } catch (error) {
      logger.error('Failed to add node', error)
      return
    }

    const updateNodes: AppNode[] = []
    const nextNodes: AppNode[] = getNodes().map((node) => {
      if (!selectedNodeIds.includes(node.id)) {
        return node
      }
      const updateNode: AppNode = {
        ...node,
        position: {
          x: node.position.x - parentPosition.x,
          y: node.position.y - parentPosition.y,
        },
        extent: 'parent',
        parentId: groupNode.id,
        expandParent: true,
      }
      updateNodes.push(updateNode)
      return updateNode
    })

    try {
      await updateNodesMutate({ nodes: updateNodes })
      saveHistory('group', updateNodes, [])
    } catch (error) {
      logger.error('Failed to update nodes', error)
      return
    }

    store.getState().resetSelectedElements()
    store.setState({ nodesSelectionActive: false })
    setNodes([groupNode, ...nextNodes].sort(sortNode))
  }

  const handleUngroup = useCallback(async () => {
    const childNodeIds = childNodes.map((node) => node.id)
    await detachNodes(childNodeIds, id)
  }, [childNodes, detachNodes, id])

  const handleAlign = useCallback(
    async (orientation: 'middle' | 'center') => {
      await align(targetNode, selectedNodes, orientation)
    },
    [align, selectedNodes, targetNode],
  )

  const handleFold = useCallback(async () => {
    const allChildNodes = getAllChildNodes(targetNode)
    await fold(targetNode, allChildNodes)
  }, [fold, getAllChildNodes, targetNode])

  const handleUnfold = useCallback(async () => {
    const allChildNodes = getAllChildNodes(targetNode)
    await unfold(targetNode, allChildNodes)
  }, [getAllChildNodes, targetNode, unfold])

  return (
    <ContextMenu
      left={props.mouse.x}
      top={props.mouse.y}
      onClick={props.onClick}
    >
      <DropdownMenu open={true} modal={false} onOpenChange={props.onClick}>
        <DropdownMenuTrigger />
        <DropdownMenuContent>
          <DropdownMenuItem
            className={menuItemStyle}
            disabled={
              targetNode.type === 'Start' || targetNode.type === 'Ghost'
            }
            onSelect={handleDelete}
          >
            <TrashIcon size={icon} />
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={menuItemStyle}
            disabled={!canGroup}
            onSelect={handleGroup}
          >
            <GroupIcon size={icon} />
            Group
          </DropdownMenuItem>
          <DropdownMenuItem
            className={menuItemStyle}
            disabled={!canUnGroup}
            onSelect={handleUngroup}
          >
            <UngroupIcon size={icon} />
            Ungroup
          </DropdownMenuItem>
          <DropdownMenuItem
            className={menuItemStyle}
            disabled={!hasParent}
            onSelect={handleDetach}
          >
            <SplitIcon size={icon} />
            Detach
          </DropdownMenuItem>
          <DropdownMenuItem
            className={menuItemStyle}
            disabled={!canFold}
            onSelect={handleFold}
          >
            <FoldIcon width={icon} height={icon} />
            Fold
          </DropdownMenuItem>
          <DropdownMenuItem
            className={menuItemStyle}
            disabled={!canUnfold}
            onSelect={handleUnfold}
          >
            <UnfoldIcon width={icon} height={icon} />
            Unfold
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={menuItemStyle}
            disabled={!canAlign}
            onSelect={() => handleAlign('center')}
          >
            <AlignHorizontalSpaceAroundIcon size={icon} />
            Align Center
          </DropdownMenuItem>
          <DropdownMenuItem
            className={menuItemStyle}
            disabled={!canAlign}
            onSelect={() => handleAlign('middle')}
          >
            <AlignVerticalSpaceAroundIcon size={12} />
            Align Middle
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ContextMenu>
  )
}
