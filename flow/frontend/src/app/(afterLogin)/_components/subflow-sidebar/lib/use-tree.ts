import { FlowTreeData } from '@/models/subflow-list'
import logger from '@/utils/logger'
import { hasDuplicateFolderName } from '@/utils/tree'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CreateHandler,
  DeleteHandler,
  MoveHandler,
  NodeApi,
  RenameHandler,
  SimpleTree,
  TreeApi,
} from 'react-arborist'
import { IdObj } from 'react-arborist/dist/module/types/utils'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

export type CustomCreateHandler<T> = (args: {
  parentId: number | null
  name: string
  node: NodeApi<T>
}) => (IdObj | null) | Promise<IdObj | null | undefined>

export type CustomRenameHandler<T> = (args: {
  id: string
  name: string
  node: NodeApi<T>
}) => Promise<unknown>

export default function useTree<T extends FlowTreeData>(
  initialData: T[],
  tree: TreeApi<T> | null,
  ascending: boolean,
  options?: {
    onTreeChange?: (tree: T[]) => void
    onBeforeCreate?: CustomCreateHandler<T>
    onBeforeDelete?: DeleteHandler<T>
    onBeforeRename?: CustomRenameHandler<T>
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
  },
) {
  const [data, setData] = useState(initialData)

  const simpleTree = useMemo(() => new SimpleTree<T>(data), [data])

  useEffect(() => {
    setData(sortData(initialData))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ascending, initialData])

  const compareName = useCallback(
    (a: T, b: T) => {
      if (a.name === '') return -1
      if (b.name === '') return 1

      if (ascending) {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    },
    [ascending],
  )

  const sortData = useCallback(
    (items: T[]) => {
      if (!items) {
        return []
      }

      const folders = items.filter((item) => item.type === 'folder')
      const files = items.filter((item) => item.type === 'file')

      folders.forEach((folder) => {
        folder.children = sortData(folder.children as T[])
      })

      folders.sort(compareName)
      files.sort(compareName)

      return [...folders, ...files]
    },
    [compareName],
  )

  const onCreate: CreateHandler<T> = ({ parentId, index, type }) => {
    const ghostTree = {
      id: uuidv4(),
      name: '',
      type: type === 'internal' ? 'folder' : 'file',
      desc: '',
      updateDate: new Date(),
      version: '1.0.0',
      isCreated: true,
    } as any

    if (type === 'internal') {
      ghostTree.children = []
    }

    simpleTree.create({ parentId, index, data: ghostTree })
    const sortedData = sortData(simpleTree.data)
    setData(sortedData)

    return ghostTree
  }

  const onMove: MoveHandler<T> = (args) => {
    for (const id of args.dragIds) {
      simpleTree.move({ id, parentId: args.parentId, index: args.index })
    }
    sortAndSetData()
  }

  const onRename: RenameHandler<T> = async (args) => {
    if (args.node.data.isCreated) {
      await handleCreationProcess(args)
    } else {
      await handleRenameProcess(args)
    }
  }

  const onDelete: DeleteHandler<T> = async (args) => {
    try {
      const isCreatedNode = existCreatedNode(args)
      if (isCreatedNode) {
        return
      }

      if (options?.onBeforeDelete) {
        await options.onBeforeDelete(args)
      }

      args.nodes.forEach(async (node: NodeApi<T>) => {
        if (node && node.data.type === 'folder') {
          let parentId: string | null = node.level > 0 ? node.parent!.id : null
          node.children!.forEach((child) => {
            simpleTree.move({ id: child.id, parentId, index: 0 })
          })
        }
      })

      args.ids.forEach((id) => simpleTree.drop({ id }))

      sortAndSetData()
    } catch (error) {
      logger.error(error)
    }
  }

  const existCreatedNode = (args: { ids: string[]; nodes: NodeApi<T>[] }) => {
    const isCreated = args.nodes.length === 1 && args.nodes[0].data.isCreated
    if (isCreated) {
      args.ids.forEach((id) => simpleTree.drop({ id }))
      const sortedData = sortData(simpleTree.data)
      setData(sortedData)
      return true
    } else {
      return false
    }
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!tree) {
      return
    }
    const { focusedNode } = tree

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        tree.focus(focusedNode)
        break
      case 'ArrowRight':
        if (!focusedNode) {
          return
        }
        if (focusedNode.data.type === 'folder' && focusedNode.isOpen) {
          tree.focus(focusedNode)
        } else if (focusedNode.data.type === 'folder') {
          tree.open(focusedNode.id)
        }
        break
      case 'ArrowLeft': {
        const node = tree.focusedNode

        if (!node || node.isRoot || node.isEditing) {
          return
        }

        if (node.data.type === 'folder' && node.isOpen) {
          tree.close(node.id)
        } else if (!node.parent?.isRoot) {
          tree.focus(node.parent)
        }
        break
      }
      case 'Home':
        event.preventDefault()
        tree.focus(tree.firstNode)
        break
      case 'End':
        event.preventDefault()
        tree.focus(tree.lastNode)
        break
      case 'Enter':
        break
      case 'PageUp':
        event.preventDefault()
        tree.pageUp()
        break
      case 'PageDown':
        event.preventDefault()
        tree.pageDown()
        break
      case 'F2':
        if (['main', 'end'].includes(tree.focusedNode?.data.name ?? '')) {
          toast.warn('main, end는 변경할 수 없습니다.')
          return
        }
        focusedNode?.edit()
        break
    }

    if (options?.onKeyDown) {
      options.onKeyDown(event)
    }
  }

  const handleCreationProcess = async (args: {
    id: string
    name: string
    node: NodeApi<T>
  }) => {
    const { node, name, id } = args
    const { type, databaseId } = node.data

    if (type === 'file' && options?.onBeforeCreate) {
      const response = await options.onBeforeCreate({
        parentId: databaseId ?? null,
        name,
        node,
      })
      simpleTree.update({
        id,
        changes: {
          name,
          databaseId: +response!.id,
          isCreated: false,
        } as Partial<T>,
      })
    } else if (type === 'folder') {
      if (hasDuplicateFolderName(simpleTree.data, name)) {
        toast.warn(`${name}은(는) 이미 사용중인 폴더명 입니다.`)
        dropNode(id)
        return
      }
      simpleTree.update({
        id,
        changes: {
          name,
          isCreated: false,
        } as Partial<T>,
      })
    }
    sortAndSetData()
  }

  const handleRenameProcess = (args: {
    id: string
    name: string
    node: NodeApi<T>
  }) => {
    const { node, name, id } = args
    if (node.data.type === 'file') {
      options?.onBeforeRename && options.onBeforeRename(args)
    } else if (node.data.type === 'folder') {
      if (hasDuplicateFolderName(simpleTree.data, name)) {
        toast.warn(`${name}은(는) 이미 사용중인 폴더명입니다.`)
        return
      }
    }
    simpleTree.update({
      id,
      changes: {
        name,
      } as Partial<T>,
    })
    sortAndSetData()
  }

  const dropNode = (id: string) => {
    simpleTree.drop({ id })
    const sortedData = sortData(simpleTree.data)
    setData(sortedData)
  }

  const sortAndSetData = () => {
    const sortedData = sortData(simpleTree.data)
    setData(sortedData)
    options?.onTreeChange?.(sortedData)
  }

  const attachTree = (parentId: string | null, data: T) => {
    simpleTree.create({
      parentId,
      data,
      index: 0,
    })

    sortAndSetData()
  }

  return {
    data,
    onCreate,
    onRename,
    onDelete,
    onMove,
    onKeyDown,
    attachTree,
  }
}
