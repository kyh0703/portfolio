'use client'

import { Input } from '@/app/_components/input'
import CustomTooltip from '@/app/_components/tooltip'
import { FlowTreeData } from '@/models/subflow-list'
import { useModalStore } from '@/store/modal'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/ui/context-menu'
import { Separator } from '@/ui/separator'
import { cn } from '@/utils/cn'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileIcon,
  FolderClosedIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { memo, useRef } from 'react'
import { NodeRendererProps } from 'react-arborist'
import { TreeProps } from 'react-arborist/dist/module/types/tree-props'

type SearchListItemProps = NodeRendererProps<FlowTreeData> &
  TreeProps<FlowTreeData>

const contextMenuItemStyle =
  'hover:bg-accent relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

const Node = ({ node, style, dragHandle, tree }: SearchListItemProps) => {
  const {
    type: nodeType,
    name: nodeName,
    desc: nodeDesc,
    updateDate: nodeUpdateDate,
  } = node.data

  const router = useRouter()
  const isOpenContextMenu = useRef<boolean>(false)
  const openModal = useModalStore((state) => state.openModal)

  const handleDoubleClick = () => {
    if (nodeType === 'file' && !node.isEditing) {
      router.push(`/subflows/${node.data.databaseId}`)
    }
  }

  const handleOpenPropertiesModal = () => {
    openModal('sub-flow-property-modal', { mode: 'update', data: node.data })
  }

  const handleBlur = () => {
    if (node.data.isCreated) {
      tree.delete(node.id)
    } else {
      node.reset()
    }
  }

  return (
    <ContextMenu
      modal={isOpenContextMenu.current}
      onOpenChange={() => {
        node.select()
      }}
    >
      <ContextMenuTrigger>
        <div
          ref={dragHandle}
          style={style}
          className={cn(
            'text-text',
            'relative mx-2 rounded-md',
            'group-focus:border-blue-500 group-focus:text-main',
            node.isSelected
              ? 'bg-blue-300 text-main'
              : 'group-hover:bg-accent group-hover:text-text group-focus:text-text',
          )}
        >
          <div
            className="flex h-7 items-center gap-1 px-2"
            onClick={() => nodeType === 'folder' && node.toggle()}
            onDoubleClick={handleDoubleClick}
          >
            <div className="flex shrink-0 gap-1">
              {nodeType === 'file' ? (
                <FileIcon
                  className="text-[#757575] dark:text-[#B0BEC5]"
                  width={15}
                  height={15}
                />
              ) : (
                <>
                  {node.isOpen ? (
                    <ChevronDownIcon
                      className="text-[#757575] dark:text-[#B0BEC5]"
                      width={15}
                      height={15}
                    />
                  ) : (
                    <ChevronRightIcon
                      className="text-[#757575] dark:text-[#B0BEC5]"
                      width={15}
                      height={15}
                    />
                  )}
                  <FolderClosedIcon
                    className="text-[#1976D2] dark:text-[#FF9800]"
                    width={15}
                    height={15}
                  />
                </>
              )}
            </div>
            {node.isEditing ? (
              <Input
                className="ml-2 h-5 w-full grow px-1 text-text focus-visible:rounded-[1px] focus-visible:outline-none focus-visible:ring-offset-0 active:outline-none"
                type="text"
                defaultValue={nodeName}
                autoFocus
                onFocus={(e) => e.currentTarget.select()}
                onBlur={(e) => node.submit(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') node.submit('')
                  if (e.key === 'Enter') node.submit(e.currentTarget.value)
                }}
              />
            ) : (
              <CustomTooltip
                triggerChild={
                  <span className="grow overflow-hidden text-ellipsis text-nowrap">
                    {nodeName}
                  </span>
                }
                contentChild={
                  <div>
                    <div>{nodeName}</div>
                    <Separator />
                    <div>{nodeDesc}</div>
                    <Separator />
                    <div>{nodeUpdateDate?.toString()}</div>
                  </div>
                }
              />
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      {!['main', 'end'].includes(nodeName.toLocaleLowerCase()) && (
        <ContextMenuContent className="group">
          {nodeType === 'folder' && (
            <>
              <div
                className={contextMenuItemStyle}
                onClick={() =>
                  tree.create({ parentId: node.id, type: 'internal' })
                }
              >
                Create Folder
              </div>
              <div
                className={contextMenuItemStyle}
                onClick={() => tree.create({ parentId: node.id, type: 'leaf' })}
              >
                Create File
              </div>
            </>
          )}

          <div className={contextMenuItemStyle} onClick={() => node.edit()}>
            Rename
          </div>
          <div
            className={contextMenuItemStyle}
            onClick={() => tree.delete(node.id)}
          >
            Delete
          </div>
          <div
            className={contextMenuItemStyle}
            onClick={handleOpenPropertiesModal}
          >
            Properties
          </div>
        </ContextMenuContent>
      )}
    </ContextMenu>
  )
}

export default memo(Node)
