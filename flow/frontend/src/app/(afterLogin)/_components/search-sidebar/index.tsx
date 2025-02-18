'use client'

import ConfirmModal from '@/app/_components/confirm-modal'
import { Modal } from '@/app/_components/modal'
import { useWebSocket } from '@/contexts/websocket-context'
import type { Message } from '@/models/web-socket/message'
import { ReplaceProgress } from '@/models/web-socket/replace/progress'
import { ReplaceRequest } from '@/models/web-socket/replace/request'
import { ReplaceResult } from '@/models/web-socket/replace/result'
import { SearchProgress } from '@/models/web-socket/search/progress'
import type {
  DefineData,
  MenuData,
  PropertyData,
  SearchTreeData,
} from '@/models/web-socket/search/types'
import { getInFlows } from '@/services/flow'
import { useBuildStore } from '@/store/build'
import { useUserContext } from '@/store/context'
import { useModalStore } from '@/store/modal'
import { useSearchStore } from '@/store/search'
import { Progress } from '@/ui/progress'
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { RenameHandler, Tree, TreeApi } from 'react-arborist'
import { toast } from 'react-toastify'
import useResizeObserver from 'use-resize-observer'
import { useShallow } from 'zustand/react/shallow'
import { filterDefineItem } from '../define-sidebar/filter'
import { defineItems } from '../define-sidebar/types'
import SearchAction from './_components/action'
import SearchFilter from './_components/filter'
import SearchInput from './_components/input'
import node from './_components/node'
import { getDefineNodeId, getMenuNodeId, getPropertyNodeId } from './_lib/tree'
import { useTree } from './_lib/use-tree'

export default function SearchSidebar() {
  const treeRef = useRef<TreeApi<SearchTreeData>>(null)
  const isReplaceAllRef = useRef(false)

  const { type: flowType, mode: flowMode } = useUserContext()
  const [height, setHeight] = useState(0)
  const [percent, setPercent] = useState(0)

  const isBuilding = useBuildStore(
    useShallow((state) => state.build.isBuilding),
  )
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

  const [options, resetAll, setHighlightText] = useSearchStore(
    useShallow((state) => [
      state.options,
      state.resetAll,
      state.setHighlightText,
    ]),
  )

  const {
    data: treeData,
    onCreate,
    onDelete,
    onFind,
    clear,
    getIndex,
  } = useTree()

  const filteredDefineItems = useMemo(
    () => [
      ...new Set(
        defineItems
          .filter((item) =>
            filterDefineItem(item, {
              flowType,
              flowMode,
            }),
          )
          .map((item) => item.name),
      ),
    ],
    [flowMode, flowType],
  )

  const removeParentNode = useCallback(
    (childrenNodeId: string) => {
      const targetChildNode = treeRef.current?.get(childrenNodeId)
      const parentNode = targetChildNode?.parent
      if (targetChildNode?.nextSibling === null && parentNode?.id) {
        onDelete({ ids: [parentNode.id] })
      }
    },
    [onDelete],
  )

  const handleReplaceProgress = useCallback(
    ({
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

      let propertyNodeId = null
      let defineNodeId = null
      let menuNodeId = null

      onDelete({
        ids: properties.map((property) => {
          propertyNodeId = getPropertyNodeId(property)
          return propertyNodeId
        }),
      })
      propertyNodeId && removeParentNode(propertyNodeId)

      onDelete({
        ids: defines.map((define) => {
          defineNodeId = getDefineNodeId(define)
          return defineNodeId
        }),
      })
      defineNodeId && removeParentNode(defineNodeId)

      onDelete({
        ids: menus.map((menu) => {
          menuNodeId = getMenuNodeId(menu)
          return menuNodeId
        }),
      })
      menuNodeId && removeParentNode(menuNodeId)
    },
    [onDelete, removeParentNode],
  )

  const handleSearchProgress = useCallback(
    ({
      data: { filters, progress, query, results },
    }: Message<SearchProgress>) => {
      const { properties, defines, menus } = results
      const tree = treeRef.current
      if (!tree) {
        return
      }
      if (
        progress === 100 &&
        defines.length === 0 &&
        properties.length === 0 &&
        menus.length === 0
      ) {
        toast.info('검색 결과가 없습니다.')
        return
      }

      const convertPropertyTreeDataHasOrigin = (property: PropertyData) => {
        const parentId = `${property.subFlowName} / ${property.nodeName}`
        const hasParentNode = onFind(parentId)

        if (!hasParentNode) {
          const parentNode = {
            ...property,
            id: parentId,
            name: parentId,
            children: [],
          }
          onCreate({
            parentId: null,
            index: getIndex(),
            data: parentNode,
          })
        }

        const childNode = {
          ...property,
          id: getPropertyNodeId(property),
          name: `${property.path.split('.').pop()} / ${property.origin}`,
        }

        onCreate({
          parentId,
          index: hasParentNode?.children?.length ?? 0,
          data: childNode,
        })
      }
      const convertDefineTreeDataHasOrigin = (define: DefineData) => {
        const parentId = `${define.scope} / ${define.defineType}`
        const hasParentNode = onFind(parentId)

        if (!hasParentNode) {
          const parentNode = {
            ...define,
            id: parentId,
            name: parentId,
            children: [],
          }
          onCreate({
            parentId: null,
            index: getIndex(),
            data: parentNode,
          })
        }

        const childNode = {
          ...define,
          id: getDefineNodeId(define),
          name: `${define.path.split('.').pop()} / ${define.origin}`,
        }

        onCreate({
          parentId,
          index: hasParentNode?.children?.length ?? 0,
          data: childNode,
        })
      }
      const convertMenuTreeDataHasOrigin = (menu: MenuData) => {
        const parentId = `menu / ${menu.menuName}`
        const hasParentNode = onFind(parentId)

        if (!hasParentNode) {
          const parentNode = {
            ...menu,
            id: parentId,
            name: parentId,
            children: [],
          }
          onCreate({
            parentId: null,
            index: getIndex(),
            data: parentNode,
          })
        }

        const childNode = {
          ...menu,
          id: getMenuNodeId(menu),
          name: `${menu.path.split('.').pop()} / ${menu.origin}`,
        }

        onCreate({
          parentId,
          index: hasParentNode?.children?.length ?? 0,
          data: childNode,
        })
      }
      const convertPropertyTreeData = (property: PropertyData) => {
        const id = `${property.subFlowName} / ${property.nodeName}`
        const node = {
          ...property,
          id,
          name: id,
        }
        onCreate({
          parentId: null,
          index: tree.root.children?.length ?? 0,
          data: node,
        })
      }

      // origin이 있는 경우
      if (query || filters.propertyName) {
        properties.forEach(convertPropertyTreeDataHasOrigin)
        defines.forEach((define) => convertDefineTreeDataHasOrigin(define))
        menus.forEach(convertMenuTreeDataHasOrigin)
      } else {
        // origin이 없는 경우
        // 검색값 없음, Property Name 없음, Node Type(Node) 의 경우만 남음
        properties.forEach(convertPropertyTreeData)
      }
      setPercent(progress)
    },
    [getIndex, onCreate, onFind],
  )

  const handleReplaceResult = useCallback(
    (message: Message<ReplaceResult>) => {
      const { status, errorCode, errorMessage } = message.data
      setPercent(0)

      if (status === 'success' && isReplaceAllRef.current) {
        isReplaceAllRef.current = false
        clear()
      } else if (status === 'failure') {
        toast.error(`${errorCode}: ${errorMessage}`)
      }
    },
    [clear],
  )

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
  }, [
    handleReplaceProgress,
    handleSearchProgress,
    handleReplaceResult,
    subscribe,
  ])

  const createReplaceMessage = (): ReplaceRequest => ({
    query: options.search,
    replace: options.replace,
    target: {
      properties: [],
      defines: [],
      menus: [],
    },
  })

  const getSubFlowIdFromSubFlowName = async () => {
    let subFlowId = 0
    if (options.subFlowName) {
      const inflows = await getInFlows()
      const targetSubFlowId = inflows.flow.find(
        ({ name }) => name === options.subFlowName,
      )
      if (targetSubFlowId) {
        subFlowId = targetSubFlowId.id
      }
    }

    return subFlowId
  }

  const handleSearchRequest = async () => {
    clear()
    sendSearchRequest()
    setHighlightText(options.search)
  }

  const sendSearchRequest = async () => {
    const subFlowId = await getSubFlowIdFromSubFlowName()

    const message = {
      query: options.search,
      filters: {
        subFlowId,
        nodeKind: options.nodeKind,
        nodeType: filteredDefineItems.includes(options.nodeKind)
          ? 'define'
          : 'node',
        propertyName: options.propertyName,
        useMatchWholeWord: options.useMatchWholeWord,
        useMatchCase: options.useMatchCase,
      },
    }
    send('searchRequest', message)
  }

  const convertSearchTree = (node: SearchTreeData) => {
    const result = { ...node } as Partial<SearchTreeData>
    delete result.id
    delete result.name
    result.replace = result.origin?.replaceAll(options.search, options.replace)
    return result
  }

  const handleReplaceRequest: RenameHandler<SearchTreeData> = ({ node }) => {
    if (isBuilding) {
      toast.warn('빌드 중에는 편집할 수 없습니다.')
      return
    }
    const message = createReplaceMessage()

    if (node.isInternal) {
      switch (node.data.itemType) {
        case 'property':
          node.children?.forEach((child) => {
            message.target.properties.push(
              convertSearchTree(child.data) as PropertyData,
            )
          })
          break
        case 'define':
          node.children?.forEach((child) => {
            message.target.defines.push(
              convertSearchTree(child.data) as DefineData,
            )
          })
          break
        case 'menu':
          node.children?.forEach((child) => {
            message.target.menus.push(convertSearchTree(child.data) as MenuData)
          })
          break
      }
    } else {
      switch (node.data.itemType) {
        case 'property':
          message.target.properties.push(
            convertSearchTree(node.data) as PropertyData,
          )
          break
        case 'define':
          message.target.defines.push(
            convertSearchTree(node.data) as DefineData,
          )
          break
        case 'menu':
          message.target.menus.push(convertSearchTree(node.data) as MenuData)
          break
      }
    }

    send('replaceRequest', message)
  }

  const handleReplaceAllRequest = () => {
    if (isBuilding) {
      toast.warn('빌드 중에는 편집할 수 없습니다.')
      return
    }
    const message = createReplaceMessage()

    treeData.forEach((node) => {
      switch (node.itemType) {
        case 'property':
          node.children?.forEach((child) => {
            message.target.properties.push(
              convertSearchTree(child) as PropertyData,
            )
          })
          break
        case 'define':
          node.children?.forEach((child) => {
            message.target.defines.push(convertSearchTree(child) as DefineData)
          })
          break
        case 'menu':
          node.children?.forEach((child) => {
            message.target.menus.push(convertSearchTree(child) as MenuData)
          })
          break
      }
    })

    send('replaceRequest', message)
    isReplaceAllRef.current = true
  }

  const handleSearchResult = (message: Message<SearchResult>) => {
    const { status, errorCode, errorMessage } = message.data
    setPercent(0)
    if (status === 'failure') {
      toast.error(`${errorCode}: ${errorMessage}`)
    }
  }

  const handleOpenModalButton = useCallback(() => {
    openModal('confirm-replace-modal', null)
  }, [openModal])

  const handleCollapseAllButton = useCallback(() => {
    toggleIsOpenCollapseAll()
    if (isOpenCollapseAll) {
      treeRef.current?.openAll()
    } else {
      treeRef.current?.closeAll()
    }
  }, [isOpenCollapseAll])

  const handleResetAllButton = useCallback(() => {
    if (isOpenCollapseAll) {
      toggleIsOpenCollapseAll()
    }
    resetAll()
    clear()
  }, [clear, isOpenCollapseAll, resetAll])

  return (
    <aside className="flex h-full flex-col gap-0.5 overflow-hidden">
      <Modal id="confirm-replace-modal">
        <ConfirmModal
          content="정말 바꾸시겠습니까?"
          onConfirm={handleReplaceAllRequest}
        />
      </Modal>
      {percent !== 0 && (
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
        treeDataLength={treeData.length}
        disable={percent !== 0}
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
          rowClassName="whitespace-nowrap cursor-pointer focus:outline-none"
          openByDefault={true}
          rowHeight={25}
          disableDrag
          disableMultiSelection
          onRename={handleReplaceRequest}
          onDelete={onDelete}
        >
          {node}
        </Tree>
      </div>
    </aside>
  )
}
