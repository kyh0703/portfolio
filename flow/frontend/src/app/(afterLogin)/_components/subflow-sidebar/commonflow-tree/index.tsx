'use client'

import ConfirmModal from '@/app/_components/confirm-modal'
import { Modal } from '@/app/_components/modal'
import { FlowTreeData, SubFlowList } from '@/models/subflow-list'
import {
  useQueryCommonFlowTree,
  useUpdateCommonFlowTree,
} from '@/services/flow'
import { useModalStore } from '@/store/modal'
import { height as themeHeight } from '@/themes'
import { cn } from '@/utils/cn'
import { convertFlowTree, convertFlowTreeData } from '@/utils/tree'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useReducer, useRef } from 'react'
import { NodeApi, Tree, TreeApi } from 'react-arborist'
import useResizeObserver from 'use-resize-observer'
import PropertiesModal from '../_components/properties-modal'
import useTree from '../lib/use-tree'
import Action from './action'
import CommonFlowEditModal from './modal'
import Node from './node'

type CommonSubFlowProps = {
  search: string
}

export default function CommonFlowTree({ search }: CommonSubFlowProps) {
  const { ref, width, height } = useResizeObserver()
  const treeHeight = height
    ? height - parseInt(themeHeight['sidebar-title'], 10)
    : 0

  const openModal = useModalStore((state) => state.openModal)
  const clipboardNodes = useRef<NodeApi<FlowTreeData>[]>([])
  const treeRef = useRef<TreeApi<FlowTreeData>>(null)
  const [ascending, toggleAscending] = useReducer((state) => !state, false)

  const { mutateAsync: updateCommonFlowTreeMutation } =
    useUpdateCommonFlowTree()

  const {
    data: { flowtree },
  } = useSuspenseQuery(useQueryCommonFlowTree())

  const flowTreeData = useMemo(() => {
    return convertFlowTreeData(flowtree)
  }, [flowtree])

  const {
    data: treeData,
    onCreate,
    onRename,
    onDelete,
    onMove,
    onKeyDown,
  } = useTree<FlowTreeData>(flowTreeData, treeRef.current, ascending, {
    onTreeChange: async (flowtree: FlowTreeData[]) => {
      await updateCommonFlowTreeMutation({
        flowtree: convertFlowTree(flowtree),
      })
    },
    onKeyDown: (event) => {
      const selectedNode = treeRef.current?.selectedNodes[0]
      switch (event.key) {
        case 'Delete':
          if (selectedNode && selectedNode.data.type === 'folder') {
            handleOpenDeleteModal([selectedNode])
          }
      }
    },
  })

  const handleCreate = () => {
    const tree = treeRef.current
    if (!tree) return

    let parentId = null
    let index = 0

    const selectedNodes = tree.selectedNodes

    if (selectedNodes.length > 0) {
      const lastNodeWithChildren = selectedNodes
        .filter((node) => node.data.type === 'folder')
        .pop()
      if (lastNodeWithChildren) {
        parentId = lastNodeWithChildren.id
      } else {
        if (selectedNodes[0].level > 0) {
          parentId = selectedNodes[0].parent!.id
        }
      }
    }

    tree.create({ parentId, index, type: 'internal' })
  }

  const openEditModal = () => {
    openModal('common-flow-list-modal', null)
  }

  const handleAddTree = (subFlowLists: SubFlowList[]) => {
    const tree = treeRef.current
    if (!tree) return

    const newNodes = subFlowLists.map(
      (flow) =>
        ({
          ...flow,
          id: flow.id.toString(),
          databaseId: flow.id,
          type: 'file',
        }) as FlowTreeData,
    )

    let newTree = []

    const selectedNode = tree.selectedNodes[0]
    if (selectedNode && selectedNode.isInternal) {
      const addNodesToTree = (
        nodes: FlowTreeData[],
        newNodes: FlowTreeData[],
      ): FlowTreeData[] => {
        return nodes.map((node) => {
          if (selectedNode.id === node.id) {
            node.children = [...(node.children || []), ...newNodes]
          } else if (node.children) {
            node.children = addNodesToTree(node.children, newNodes)
          }
          return node
        })
      }
      newTree = addNodesToTree(treeData, newNodes)
    } else {
      newTree = [...treeData, ...newNodes]
    }

    updateCommonFlowTreeMutation({
      flowtree: convertFlowTree(newTree),
    })
  }
  const handleRemoveTreeByName = (names: string[]) => {
    const removeNodeByName = (nodes: FlowTreeData[]): FlowTreeData[] => {
      return nodes.reduce((acc: FlowTreeData[], node) => {
        if (node.children) {
          node.children = removeNodeByName(node.children)
        }
        if (!names.includes(node.name)) {
          acc.push(node)
        }
        return acc
      }, [])
    }

    const newTree = removeNodeByName(treeData)
    updateCommonFlowTreeMutation({
      flowtree: convertFlowTree(newTree),
    })
  }

  const handleChangeTree = (data: SubFlowList) => {
    const updateNode = (node: FlowTreeData): FlowTreeData => {
      if (node.name === data.name) {
        return {
          ...node,
          ...data,
          id: data.id.toString(),
          databaseId: data.id,
        }
      } else if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNode),
        }
      }
      return node
    }

    const newTree = treeData.map(updateNode)
    updateCommonFlowTreeMutation({
      flowtree: convertFlowTree(newTree),
    })
  }

  const handleOpenDeleteModal = (nodes: NodeApi<FlowTreeData>[]) => {
    clipboardNodes.current = nodes

    openModal('delete-common-flow-tree-modal', null)
  }

  const handleConfirmDelete = useCallback(() => {
    onDelete({
      ids: clipboardNodes.current.map((node) => node.id),
      nodes: clipboardNodes.current,
    })
    clipboardNodes.current = []
  }, [onDelete])

  const handleSubmitPropertiesModal = useCallback(
    async (origin: FlowTreeData, replace: FlowTreeData) => {
      if (origin.name === replace.name && origin.desc === replace.desc) return

      const tree = treeRef.current
      if (!tree) return

      updateCommonFlowTreeMutation({
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
              return node as FlowTreeData
            })
          })(treeData),
        ),
      })
    },
    [treeData, updateCommonFlowTreeMutation],
  )

  return (
    <>
      <Modal id="delete-common-flow-tree-modal">
        <ConfirmModal
          content="폴더를 삭제하면 하위의 모든 Common SubFlow가 상위 폴더로 이동합니다."
          onConfirm={handleConfirmDelete}
        />
      </Modal>
      <Modal
        id="common-flow-list-modal"
        title="Edit Common SubFlow"
        className="w-4/6"
      >
        <CommonFlowEditModal
          handleAddTree={handleAddTree}
          handleRemoveTreeByName={handleRemoveTreeByName}
          handleChangeTree={handleChangeTree}
        />
      </Modal>
      <Modal id="common-sub-flow-property-modal" title="Flow Properties">
        <PropertiesModal onSubmit={handleSubmitPropertiesModal} />
      </Modal>
      <div ref={ref} className="flex h-full w-full flex-col">
        <div className="flex w-full justify-between px-1">
          <h2 className="ml-3 py-4">Common Sub Flow</h2>
          <Action
            ascending={ascending}
            openModal={openEditModal}
            onToggleAscending={toggleAscending}
            onCreateFolder={handleCreate}
          />
        </div>
        <div className="w-full" onKeyDown={onKeyDown}>
          <Tree
            ref={treeRef}
            data={treeData}
            height={treeHeight}
            width={width}
            rowHeight={30}
            disableEdit
            disableMultiSelection
            selectionFollowsFocus
            rowClassName={cn('group focus:outline-none')}
            searchTerm={search}
            searchMatch={(node, term) =>
              node.data.name.toLowerCase().includes(term.toLowerCase())
            }
            onCreate={onCreate}
            onRename={onRename}
            onMove={onMove}
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
