import { FlowTreeData } from '@/models/subflow-list'
import { useModalStore } from '@/store/modal'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/ui/context-menu'
import { cn } from '@/utils/cn'
import { getSubFlowPath } from '@/utils/route-path'
import { useRouter } from 'next/navigation'
import { memo, useState } from 'react'
import { NodeApi, NodeRendererProps } from 'react-arborist'
import { TreeProps } from 'react-arborist/dist/module/types/tree-props'
import CustomContextMenuItem from '../../_components/custom-context-menu-item'
import NodeInput from '../../subflow-tree/node/input'
import NodeIcon from './icon'
import NodeText from './text'

type SearchListItemProps = NodeRendererProps<FlowTreeData> &
  TreeProps<FlowTreeData> & {
    onOpenDeleteModal: (nodes: NodeApi<FlowTreeData>[]) => void
  }

function Node({
  node,
  style,
  dragHandle,
  tree,
  onOpenDeleteModal,
}: SearchListItemProps) {
  const { type } = node.data
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const openModal = useModalStore((state) => state.openModal)

  const handleMoveSubFlow = () => {
    if (type === 'folder' || node.isEditing) {
      return
    }
    router.push(getSubFlowPath(Number(node.id)))
  }

  const handleOpenPropertiesModal = () => {
    openModal('common-sub-flow-property-modal', {
      mode: 'update',
      data: node.data,
    })
  }

  const handleOpenFolder = () => type === 'folder' && node.toggle()

  return (
    <ContextMenu modal={isOpen}>
      <ContextMenuTrigger disabled={type === 'file'}>
        <div
          ref={dragHandle}
          style={style}
          className={cn(
            'relative mx-2 rounded-md text-sm text-icon group-hover:font-medium',
            node.isSelected
              ? 'bg-[#2196F3] font-medium'
              : 'group-hover:bg-tree-hover',
          )}
        >
          <div
            className="flex h-7 items-center gap-1 px-3"
            onClick={handleOpenFolder}
            onDoubleClick={handleMoveSubFlow}
          >
            <NodeIcon type={type} isOpen={node.isOpen} />
            {node.isEditing ? (
              <NodeInput node={node} tree={tree} />
            ) : (
              <NodeText data={node.data} />
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent onClick={() => setIsOpen(false)}>
        <CustomContextMenuItem
          onClick={() => tree.create({ parentId: node.id, type: 'internal' })}
        >
          Create Folder
        </CustomContextMenuItem>
        <CustomContextMenuItem onClick={() => node.edit()}>
          Rename
        </CustomContextMenuItem>
        <CustomContextMenuItem onClick={() => onOpenDeleteModal([node])}>
          Delete
        </CustomContextMenuItem>
        <CustomContextMenuItem onClick={handleOpenPropertiesModal}>
          Properties
        </CustomContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default memo(Node)
