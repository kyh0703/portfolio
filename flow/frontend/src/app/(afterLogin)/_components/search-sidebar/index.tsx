'use client'

import ConfirmModal from '@/app/_components/confirm-modal'
import { Modal } from '@/app/_components/modal'
import { useWebSocket } from '@/contexts/websocket-context'
import type { Message } from '@/models/web-socket/message'
import { ReplaceProgress } from '@/models/web-socket/replace/progress'
import { ReplaceRequest } from '@/models/web-socket/replace/request'
import { ReplaceResult } from '@/models/web-socket/replace/result'
import { SearchProgress } from '@/models/web-socket/search/progress'
import type { SearchTreeData } from '@/models/web-socket/search/types'
import { useQueryAllInFlow } from '@/services/flow'
import { useModalStore } from '@/store/modal'
import { useSearchStore } from '@/store/search'
import { Progress } from '@/ui/progress'
import { cn } from '@/utils'
import logger from '@/utils/logger'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useReducer, useRef, useState } from 'react'
import {
  DeleteHandler,
  NodeApi,
  RenameHandler,
  Tree,
  TreeApi,
} from 'react-arborist'
import { toast } from 'react-toastify'
import useResizeObserver from 'use-resize-observer'
import { useShallow } from 'zustand/react/shallow'
import { globalItems as defines } from '../define-sidebar/items'
import SearchAction from './_components/action'
import SearchFilter from './_components/filter'
import SearchInput from './_components/input'
import node from './_components/node'
import {
  getDefineId,
  getMenuId,
  getPropertyId,
  mapDefineNode,
  mapDefineReplaceItem,
  mapMenuNode,
  mapMenuReplaceItem,
  mapNodesHasOrigin,
  mapPropertyNode,
  mapPropertyNodeHasPath,
  mapPropertyReplaceItem,
} from './libs/map-node'

export default function SearchSidebar() {
  const treeRef = useRef<TreeApi<SearchTreeData>>(null)
  const [percent, setPercent] = useState(0)
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'failure'
  >('idle')
  const [height, setHeight] = useState(0)

  const openModal = useModalStore((state) => state.openModal)
  const { send, subscribe } = useWebSocket()
  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: ({ height }) => height && setHeight(height),
  })

  const [isOpenFilter, toggleIsOpenFilter] = useReducer(
    (state) => !state,
    false,
  )
  const [isOpenCollapseAll, toggleIsOpenCollapseAll] = useReducer(
    (state) => !state,
    false,
  )

  const [
    treeData,
    search,
    replace,
    subFlowName,
    nodeKind,
    propertyName,
    useMatchWholeWord,
    useMatchCase,
    setTreeData,
    resetAll,
    setHighlightText,
  ] = useSearchStore(
    useShallow((state) => [
      state.data,
      state.search,
      state.replace,
      state.subFlowName,
      state.nodeKind,
      state.propertyName,
      state.useMatchWholeWord,
      state.useMatchCase,
      state.setData,
      state.resetAll,
      state.setHighlightText,
    ]),
  )

  const {
    data: { flow },
  } = useSuspenseQuery(useQueryAllInFlow())

  useEffect(() => {
    const unsubscribeSearchProgress = subscribe(
      'searchProgress',
      handleSearchProgress,
    )
    const unsubscribeSearchResult = subscribe(
      'searchResult',
      handleSearchResult,
    )
    const unsubscribeReplaceProgress = subscribe(
      'replaceProgress',
      handleReplaceProgress,
    )
    const unsubscribeReplaceResult = subscribe(
      'replaceResult',
      handleReplaceResult,
    )

    return () => {
      unsubscribeSearchProgress()
      unsubscribeSearchResult()
      unsubscribeReplaceProgress()
      unsubscribeReplaceResult()
    }
  }, [subscribe])

  const handleSearchResult = (message: Message<SearchResult>) => {
    const { status, errorCode, errorMessage } = message.data
    setStatus(status)
    if (status === 'failure') {
      toast.error(`${errorCode}: ${errorMessage}`)
    }
  }

  const handleReplaceResult = (message: Message<ReplaceResult>) => {
    const { status, errorCode, errorMessage } = message.data
    setStatus(status)
    if (status === 'failure') {
      toast.error(`${errorCode}: ${errorMessage}`)
    }
  }

  const handleOpenModalButton = () => openModal('confirm-replace-modal', null)

  const handleCollapseAllButton = () => {
    toggleIsOpenCollapseAll()
    isOpenCollapseAll ? treeRef.current?.openAll() : treeRef.current?.closeAll()
  }

  const handleResetAllButton = () => {
    if (isOpenCollapseAll) toggleIsOpenCollapseAll()
    resetAll()
  }

  const handleSearchRequest = () => {
    try {
      const subFlowId = subFlowName
        ? flow.find(({ name }) => name === subFlowName)!.id
        : 0
      const message = {
        type: 'searchRequest',
        data: {
          query: search,
          filters: {
            subFlowId,
            nodeKind,
            nodeType: defines.includes(nodeKind) ? 'define' : 'node',
            propertyName,
            useMatchWholeWord,
            useMatchCase,
          },
        },
        timestamp: new Date(),
      }

      send(message)
      setStatus('pending')
      setTreeData([])
      setHighlightText(search)
    } catch (e) {
      logger.error(e)
    }
  }

  const createReplaceMessage = (): Message<ReplaceRequest> => ({
    type: 'replaceRequest',
    data: {
      query: search,
      replace,
      target: {
        properties: [],
        defines: [],
        menus: [],
      },
    },
    timestamp: new Date(),
  })

  const addToReplaceTarget = (
    targetArray: any[],
    mapFunction: (node: SearchTreeData, replaceValue: string) => any,
    targetNode: SearchTreeData,
    replaceValue: string,
  ) => {
    targetArray.push(mapFunction(targetNode, replaceValue))
  }

  const addNodesToReplaceTarget = (
    node: SearchTreeData,
    message: Message<ReplaceRequest>,
    replaceValue: string,
  ) => {
    const addNodeToTarget = (targetNode: SearchTreeData) => {
      switch (targetNode.itemType) {
        case 'property':
          addToReplaceTarget(
            message.data.target.properties,
            mapPropertyReplaceItem,
            targetNode,
            replaceValue,
          )
          break
        case 'define':
          addToReplaceTarget(
            message.data.target.defines,
            mapDefineReplaceItem,
            targetNode,
            replaceValue,
          )
          break
        case 'menu':
          addToReplaceTarget(
            message.data.target.menus,
            mapMenuReplaceItem,
            targetNode,
            replaceValue,
          )
          break
      }
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach(addNodeToTarget)
    } else {
      addNodeToTarget(node)
    }
  }

  const handleReplaceRequest: RenameHandler<SearchTreeData> = ({
    name,
    node,
  }) => {
    try {
      const message = createReplaceMessage()
      addNodesToReplaceTarget(node.data, message, name)
      setStatus('pending')
      send(message)
    } catch (e) {
      logger.error(e)
    }
  }

  const handleReplaceAllRequest = () => {
    try {
      const message = createReplaceMessage()
      const regex = new RegExp(search, useMatchCase ? 'g' : 'gi')
      treeData.forEach((node) => {
        const replaceValue = node.origin.replaceAll(regex, replace)
        addNodesToReplaceTarget(node, message, replaceValue)
      })
      setStatus('pending')
      send(message)
    } catch (e) {
      logger.error(e)
    }
  }

  const handleSearchProgress = ({
    data: { filters, progress, query, results },
  }: Message<SearchProgress>) => {
    const { properties, defines, menus } = results

    const showNoResultsToast = () => {
      if (
        progress === 100 &&
        defines.length === 0 &&
        properties.length === 0 &&
        menus.length === 0
      ) {
        toast.info('검색 결과가 없습니다.')
      }
    }

    const updateTreeData = () => {
      if (query) {
        useSearchStore.setState((state) => {
          state.data = mapNodesHasOrigin(state.data, results)
        })
      } else {
        let addDatas: SearchTreeData[] = []
        if (filters.propertyName) {
          addDatas = [
            ...properties.map(mapPropertyNodeHasPath),
            ...defines.map(mapDefineNode),
            ...menus.map(mapMenuNode),
          ]
        } else if (filters.nodeKind) {
          addDatas = properties.map(mapPropertyNode)
        }
        useSearchStore.setState((state) => ({
          data: [...state.data, ...addDatas],
        }))
      }
    }

    showNoResultsToast()
    setPercent(progress)
    updateTreeData()
  }

  const handleReplaceProgress = ({
    data: {
      progress,
      results: { properties, defines, menus },
    },
  }: Message<ReplaceProgress>) => {
    if (
      progress === 100 &&
      defines.length === 0 &&
      properties.length === 0 &&
      menus.length === 0
    ) {
      toast.info('검색 결과가 없습니다.')
    }

    setPercent(progress)

    let shouldDeleteNodeIds: string[] = []

    shouldDeleteNodeIds = shouldDeleteNodeIds.concat(
      properties.map(getPropertyId),
      defines.map(getDefineId),
      menus.map(getMenuId),
    )

    const removeNodes = (
      nodes: SearchTreeData[],
      idsToDelete: string[],
    ): SearchTreeData[] => {
      return nodes.reduce((acc: SearchTreeData[], node) => {
        if (idsToDelete.includes(node.id)) {
          return acc
        }
        const updatedNode = { ...node }
        if (node.children) {
          updatedNode.children = removeNodes(node.children, idsToDelete)
        }
        if (!updatedNode.children || updatedNode.children.length > 0) {
          acc.push(updatedNode)
        }
        return acc
      }, [])
    }

    useSearchStore.setState((state) => {
      state.data = removeNodes(state.data, shouldDeleteNodeIds)
    })
  }

  const handleDelete: DeleteHandler<SearchTreeData> = (args: {
    ids: string[]
    nodes: NodeApi<SearchTreeData>[]
  }) => {
    const deleteNode = (
      nodes: SearchTreeData[],
      idsToDelete: string[],
    ): SearchTreeData[] => {
      return nodes.reduce((acc: SearchTreeData[], node) => {
        if (idsToDelete.includes(node.id)) {
          return acc
        }
        const updatedNode = { ...node }
        if (node.children) {
          updatedNode.children = deleteNode(node.children, idsToDelete)
        }
        if (!updatedNode.children || updatedNode.children.length > 0) {
          acc.push(updatedNode)
        }
        return acc
      }, [])
    }

    const newNodes = deleteNode(treeData, args.ids)
    setTreeData(newNodes)
  }

  return (
    <aside className="flex h-full flex-col gap-0.5 overflow-hidden">
      <Modal id="confirm-replace-modal">
        <ConfirmModal
          content="정말 바꾸시겠습니까?"
          onConfirm={handleReplaceAllRequest}
        />
      </Modal>
      {status === 'pending' && (
        <Progress className="h-1 rounded-none" value={percent} />
      )}
      <SearchAction
        isOpenFilter={isOpenFilter}
        isOpenCollapseAll={isOpenCollapseAll}
        disabled={treeData.length === 0}
        toggleIsOpenFilter={toggleIsOpenFilter}
        onResetAll={handleResetAllButton}
        onCollapseAll={handleCollapseAllButton}
      />
      <SearchInput
        onReplaceAll={handleOpenModalButton}
        onSubmit={handleSearchRequest}
        disable={status === 'pending'}
      />
      {isOpenFilter && <SearchFilter />}
      {treeData.length > 0 && (
        <div className="px-2 text-xs">{treeData.length} results</div>
      )}
      <div
        ref={ref}
        role="tree-container"
        className="grow overflow-hidden text-sm"
      >
        <Tree
          ref={treeRef}
          data={treeData}
          width="100%"
          height={height}
          rowClassName={cn(
            'whitespace-nowrap cursor-pointer focus:outline-none',
          )}
          openByDefault={true}
          disableDrag
          disableMultiSelection
          onRename={handleReplaceRequest}
          onDelete={handleDelete}
        >
          {node}
        </Tree>
      </div>
    </aside>
  )
}
