'use client'

import { Modal } from '@/app/_components/modal'
import { FlowTreeData } from '@/models/subflow-list'
import {
  useQueryCommonFlowTree,
  useUpdateCommonFlowTree,
} from '@/services/flow'
import { useModalStore } from '@/store/modal'
import { height as themeHeight } from '@/themes'
import { cn } from '@/utils/cn'
import { convertFlowTreeData } from '@/utils/tree'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo, useReducer, useRef } from 'react'
import { Tree, TreeApi } from 'react-arborist'
import useResizeObserver from 'use-resize-observer'
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
        flowtree,
      })
    },
    onBeforeDelete: async (args) => {
      if (!treeRef.current) return
      const node = args.nodes[0]
      if (node.children!.length > 0) {
        onMove({
          dragIds: node.children!.map((n) => n.id),
          dragNodes: node.children!,
          parentId: node.level > 0 ? node.parent!.id : null,
          parentNode: node.level > 0 ? node.parent : null,
          index: 0,
        })
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

  const handleAddTree = (id: number, name: string) => {
    const newNode = {
      id: id.toString(),
      name: name,
      version: '1.0.0',
      desc: '',
      updateDate: new Date(),
      databaseId: id,
      type: 'file',
      children: [],
    } as FlowTreeData

    const newTree = [...treeData, newNode]
    updateCommonFlowTreeMutation({
      flowtree: newTree,
    })
  }

  const handleRemoveTree = (name: string) => {
    const removeNodeByName = (nodes: FlowTreeData[]): FlowTreeData[] => {
      return nodes.reduce((acc: FlowTreeData[], node) => {
        if (node.children) {
          node.children = removeNodeByName(node.children)
        }
        if (node.name !== name) {
          acc.push(node)
        }
        return acc
      }, [])
    }

    const newTree = removeNodeByName(treeData)
    updateCommonFlowTreeMutation({
      flowtree: newTree,
    })
  }

  const handleChangeTree = (name: string, newId: number) => {
    const newTree = treeData.map((data) => {
      if (data.name === name) {
        return {
          ...data,
          id: newId.toString(),
          databaseId: newId,
        }
      }
      return data
    })
    updateCommonFlowTreeMutation({
      flowtree: newTree,
    })
  }

  return (
    <>
      <Modal
        id="common-flow-list-modal"
        title="Edit Common SubFlow"
        className="w-4/6"
      >
        <CommonFlowEditModal
          handleAddTree={handleAddTree}
          handleRemoveTree={handleRemoveTree}
          handleChangeTree={handleChangeTree}
        />
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
        <div
          className={cn('flex w-full grow')}
          onKeyDown={(e) => {
            if (treeRef.current) onKeyDown(e)
          }}
        >
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
          >
            {Node}
          </Tree>
        </div>
      </div>
    </>
  )
}
