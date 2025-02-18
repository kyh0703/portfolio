'use client'

import ConfirmModal from '@/app/_components/confirm-modal'
import { Modal } from '@/app/_components/modal'
import { useYjs } from '@/contexts/yjs-context'
import useYjsData from '@/hooks/use-yjs-data'
import { FlowTreeData } from '@/models/subflow-list'
import {
  useAddSubFlow,
  useQuerySubFlowTree,
  useRemoveSubFlow,
  useUpdateSubFlow,
  useUpdateSubFlowTree,
} from '@/services/flow'
import { useReplicateSubFlow } from '@/services/flow/mutations/use-replicate-sub-flow'
import { useUserContext } from '@/store/context'
import { useFlowTabStore } from '@/store/flow-tab'
import { useModalStore } from '@/store/modal'
import { height as themeHeight } from '@/themes'
import { cn } from '@/utils/cn'
import logger from '@/utils/logger'
import { getSubFlowPath } from '@/utils/route-path'
import {
  containsMainEnd,
  containsTypeFolder,
  convertFlowTree,
  convertFlowTreeData,
  generateCopyName,
  getParentNodeId,
  isMainEnd,
} from '@/utils/tree'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useReducer, useRef, useState } from 'react'
import { NodeApi, Tree, TreeApi } from 'react-arborist'
import { toast } from 'react-toastify'
import useResizeObserver from 'use-resize-observer'
import { v4 as uuidv4 } from 'uuid'
import { useShallow } from 'zustand/react/shallow'
import PropertiesModal from '../_components/properties-modal'
import useTree from '../lib/use-tree'
import Action from './action'
import Node from './node'
export default function SubFlowTree({ search }: { search: string }) {
  const { ref, width, height } = useResizeObserver()
  const treeHeight = height
    ? height - parseInt(themeHeight['sidebar-title'], 10)
    : 0

  const router = useRouter()
  const { ydoc } = useYjs()
  const { clearSubFlow } = useYjsData(ydoc)
  const { id: flowId, mode: flowMode } = useUserContext()
  const [isOpenTab, closeTab, setFlowName] = useFlowTabStore(
    useShallow((state) => [state.isOpenTab, state.closeTab, state.setFlowName]),
  )
  const openModal = useModalStore((state) => state.openModal)

  const clipboardNodes = useRef<NodeApi<FlowTreeData>[]>([])
  const treeRef = useRef<TreeApi<FlowTreeData>>(null)
  const [modalMessage, setModalContent] = useState('')
  const [ascending, toggleAscending] = useReducer((state) => !state, true)
  const { mutateAsync: addSubFlowMutate } = useAddSubFlow()
  const { mutateAsync: updateSubFlowMutate } = useUpdateSubFlow()
  const { mutateAsync: removeSubFlowMutate } = useRemoveSubFlow()
  const { mutateAsync: updateSubFlowTreeMutate } = useUpdateSubFlowTree()
  const { mutateAsync: replicateSubFlowMutate } = useReplicateSubFlow()

  const {
    data: { flowtree: tree },
  } = useSuspenseQuery(useQuerySubFlowTree())

  const flowTreeData = useMemo(() => {
    return convertFlowTreeData(tree)
  }, [tree])

  const createSubFlow = ({
    name,
    updateDate,
    id,
    desc = '',
  }: {
    name: string
    updateDate: Date
    id?: number
    desc?: string
  }) => ({
    ...(id ? { id } : {}),
    name: name,
    desc: desc,
    version: '',
    args: {
      in: {
        param: [],
      },
      out: { arg: [] },
    },
    updateDate,
  })

  const createNodeData = (
    baseData: FlowTreeData,
    additionalData: Partial<FlowTreeData>,
  ) => ({
    ...baseData,
    ...additionalData,
  })

  const {
    data: treeData,
    onCreate,
    onRename,
    onDelete,
    onMove,
    onKeyDown,
    attachTree,
  } = useTree<FlowTreeData>(flowTreeData, treeRef.current, ascending, {
    onTreeChange: async (flowtree: FlowTreeData[]) => {
      await updateSubFlowTreeMutate({
        flowtree: convertFlowTree(flowtree),
      })
    },
    onBeforeCreate: async (args) => {
      const response = await addSubFlowMutate(
        createSubFlow({
          name: args.name,
          updateDate: args.node.data.updateDate,
        }),
      )
      return { id: response.flowId.toString() }
    },
    onBeforeDelete: async (args) => {
      let hasFile = false
      let moveSubFlowId
      for await (const node of args.nodes) {
        if (node.data.type === 'file') {
          hasFile = true
          await removeSubFlowMutate({ subFlowId: node.data.databaseId! })
          const deleteSubFlowId = node.data.databaseId!
          if (isOpenTab(flowId, deleteSubFlowId)) {
            moveSubFlowId = closeTab(flowId, deleteSubFlowId)
          }
          clearSubFlow(flowMode, '' + deleteSubFlowId)
        }
      }
      if (hasFile) {
        router.push(getSubFlowPath(moveSubFlowId))
      }
    },
    onBeforeRename: async (args) => {
      await updateSubFlowMutate({
        subFlowId: args.node.data.databaseId!,
        updateSubFlow: {
          ...args.node.data,
          id: args.node.data.databaseId!,
          name: args.name,
        },
      })
      setFlowName(flowId, {
        id: args.node.data.databaseId!,
        name: args.name,
      })
    },
    onKeyDown: (event) => {
      const selectedIds = treeRef.current?.selectedIds
      const selectedNodes = treeRef.current?.selectedNodes
      if (!selectedIds || !selectedNodes) {
        return
      }

      switch (event.key) {
        case 'Delete':
          handleOpenDeleteModal(selectedNodes)
        case 'Enter':
          if (
            selectedNodes[0].data.type === 'file' &&
            !selectedNodes[0].isEditing
          ) {
            router.push(`/subflows/${selectedNodes[0].data.databaseId}`)
          }
          break
        case 'x':
          if (event.ctrlKey || event.metaKey) {
            handleCutAction(selectedNodes)
          }
          break
        case 'c':
          if (event.ctrlKey || event.metaKey) {
            handleCopyAction(selectedNodes)
          }
          break
        case 'v':
          if (event.ctrlKey || event.metaKey) {
            handlePasteAction()
          }
          break
      }
    },
  })

  const handleCutAction = (selectedNodes: NodeApi<FlowTreeData>[]) => {
    if (containsMainEnd(selectedNodes)) {
      toast.warn('main, end는 잘라낼 수 없습니다.')
      return
    }
    clipboardNodes.current = selectedNodes
    onDelete({
      ids: selectedNodes.map((node) => node.id),
      nodes: selectedNodes,
    })
  }

  const handleCopyAction = (selectedNodes: NodeApi<FlowTreeData>[]) => {
    if (containsMainEnd(selectedNodes)) {
      toast.warn('main, end는 복사할 수 없습니다.')
      return
    }

    clipboardNodes.current = selectedNodes
  }

  const handlePasteAction = async () => {
    if (!treeRef.current) return

    for (const node of clipboardNodes.current) {
      const parentId = getParentNodeId(treeRef.current)
      if (node.data.type === 'folder') {
        const replicatedData = await replicateNodeMap(node.data)
        attachTree(parentId, replicatedData)
      } else {
        const replicatedData = await handleReplicate(
          node.data.name,
          node.data.databaseId,
        )
        if (replicatedData) {
          attachTree(
            parentId,
            createNodeData(node.data, {
              id: uuidv4(),
              type: 'file',
              name: replicatedData.flowName,
              databaseId: replicatedData.flowId,
            }),
          )
        }
      }
    }
  }

  const handleReplicate = useCallback(
    async (originName: string, originId: number) => {
      const copyName = generateCopyName(treeData, originName)
      const newSubFlow = createSubFlow({
        name: copyName,
        updateDate: new Date(),
      })
      const response = await replicateSubFlowMutate({
        subFlowId: originId,
        subFlow: newSubFlow,
      })
      return {
        flowId: response.flowId,
        flowName: copyName,
        updateDate: newSubFlow.updateDate,
      }
    },
    [replicateSubFlowMutate, treeData],
  )

  const replicateNodeMap = useCallback(
    async (node: FlowTreeData) => {
      const newChildren: FlowTreeData = createNodeData(node, {
        id: uuidv4(),
        name: generateCopyName(treeData, node.name),
        updateDate: new Date(),
        type: 'folder',
        children: [],
      })
      try {
        if (node.children && node.children.length > 0) {
          for (const child of node.children!) {
            if (
              child.type === 'file' &&
              child.name !== 'main' &&
              child.name !== 'end'
            ) {
              const response = await handleReplicate(
                child.name,
                child.databaseId!,
              )
              if (response) {
                newChildren.children!.push(
                  createNodeData(child, {
                    id: uuidv4(),
                    name: response.flowName,
                    updateDate: response.updateDate,
                    type: 'file',
                    databaseId: response.flowId,
                  }),
                )
              }
            } else if (child.type === 'folder') {
              newChildren.children!.push(await replicateNodeMap(child))
            }
          }
        }
      } catch (e) {
        logger.error('Error replicating node map:', e)
      }
      return newChildren
    },
    [handleReplicate, treeData],
  )

  const handleCreate = (type: 'internal' | 'leaf') => {
    const tree = treeRef.current
    if (!tree) return

    const hasCreated = tree.visibleNodes?.some((node) => node.data.isCreated)
    if (!hasCreated) {
      tree.create({
        parentId: getParentNodeId(tree),
        type,
      })
    }
  }

  const handleOpenDeleteModal = (nodes: NodeApi<FlowTreeData>[]) => {
    if (isMainEnd(nodes)) {
      toast.warn('main, end는 삭제할 수 없습니다.')
      return
    }

    clipboardNodes.current = nodes

    setModalContent(
      containsTypeFolder(clipboardNodes.current!)
        ? '폴더를 삭제하면 하위의 모든 SubFlow가 상위 폴더로 이동합니다.'
        : '정말 삭제하시겠습니까?',
    )

    openModal('delete-flow-tree-modal', null)
  }

  const handleSubmitPropertiesModal = useCallback(
    async (origin: FlowTreeData, replace: FlowTreeData) => {
      if (origin.name === replace.name && origin.desc === replace.desc) return

      const tree = treeRef.current
      if (!tree) return

      if (origin.type === 'file') {
        updateSubFlowMutate(
          {
            subFlowId: replace.databaseId!,
            updateSubFlow: createSubFlow({
              name: replace.name,
              desc: replace.desc,
              updateDate: origin.updateDate,
            }),
          },
          {
            onSuccess: () => {
              setFlowName(flowId, {
                id: origin.databaseId!,
                name: replace.name,
              })
            },
          },
        )
      }

      updateSubFlowTreeMutate({
        flowtree: convertFlowTree(
          (function updateNode(nodes) {
            return nodes.map((node) => {
              if (node.id === origin.id) {
                node = { ...node, name: replace.name, desc: replace.desc }
              }
              if (node.children && node.children.length > 0) {
                node = {
                  ...node,
                  children: updateNode(node.children),
                }
              }
              return node
            })
          })(treeData),
        ),
      })
    },
    [
      flowId,
      setFlowName,
      treeData,
      updateSubFlowMutate,
      updateSubFlowTreeMutate,
    ],
  )

  const handleConfirmDelete = useCallback(() => {
    onDelete({
      ids: clipboardNodes.current.map((node) => node.id),
      nodes: clipboardNodes.current,
    })
    clipboardNodes.current = []
  }, [onDelete])

  return (
    <>
      <Modal id="delete-flow-tree-modal">
        <ConfirmModal content={modalMessage} onConfirm={handleConfirmDelete} />
      </Modal>
      <Modal id="sub-flow-property-modal" title="Flow Properties">
        <PropertiesModal onSubmit={handleSubmitPropertiesModal} />
      </Modal>
      <div ref={ref} className="flex h-full w-full flex-col">
        <div className="flex w-full justify-between px-1">
          <h2 className="ml-3 py-4">Sub Flow</h2>
          <Action
            ascending={ascending}
            onToggleAscending={toggleAscending}
            onCreateFolder={() => handleCreate('internal')}
            onCreateFlow={() => handleCreate('leaf')}
          />
        </div>
        <div className="w-full" onKeyDown={onKeyDown}>
          <Tree
            ref={treeRef}
            data={treeData}
            height={treeHeight}
            width={width}
            rowHeight={30}
            selectionFollowsFocus
            rowClassName={cn('group focus:outline-none')}
            searchTerm={search}
            searchMatch={(node, term) =>
              node.data.name.toLowerCase().includes(term.toLowerCase())
            }
            disableEdit
            onMove={onMove}
            onCreate={onCreate}
            onRename={onRename}
            onDelete={onDelete}
            onContextMenu={(e) => e.preventDefault()}
          >
            {(data) => (
              <Node {...data} onOpenDeleteModal={handleOpenDeleteModal} />
            )}
          </Tree>
        </div>
      </div>
    </>
  )
}
