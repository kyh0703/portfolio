import type { MenuTreeData } from '@/models/menu'
import logger from '@/utils/logger'
import { useEffect, useMemo, useState } from 'react'
import {
  SimpleTree,
  type CreateHandler,
  type DeleteHandler,
  type MoveHandler,
  type NodeApi,
  type RenameHandler,
  type TreeApi,
} from 'react-arborist'
import type { IdObj } from 'react-arborist/dist/module/types/utils'
import { v4 as uuidv4 } from 'uuid'

export type CustomCreateHandler<T> = (args: {
  parentId: number | null
  name: string
  node: NodeApi<T>
}) => (IdObj | null) | Promise<IdObj | null>

export function useTree<T extends MenuTreeData>(
  initialData: T[],
  tree: TreeApi<T> | null,
  options?: {
    onTreeChange?: (tree: T[]) => void
    onBeforeCreate?: CustomCreateHandler<T>
    onBeforeRename?: RenameHandler<T>
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
  },
) {
  const [data, setData] = useState(initialData)
  const simpleTree = useMemo(() => new SimpleTree<T>(data), [data])

  const attachTree = (parentId: string | null, data: MenuTreeData[]) => {
    data.forEach((node) => {
      simpleTree.create({
        parentId,
        data: node as T,
        index: 0,
      })
    })
  }

  const onCreate: CreateHandler<T> = (args) => {
    const ghostTree = {
      id: uuidv4(),
      name: '',
      isCreated: true,
    }

    simpleTree.create({
      parentId: args.parentId,
      index: args.index,
      data: ghostTree as T,
    })

    setData(simpleTree.data)
    return ghostTree
  }

  const onDelete: DeleteHandler<T> = async (args) => {
    try {
      args.ids.forEach((id) => {
        simpleTree.drop({ id })
      })
      setData(simpleTree.data)

      const isCreated = args.nodes.some((node) => node.data.isCreated)
      if (isCreated) {
        return
      }

      if (options?.onTreeChange) {
        options.onTreeChange(simpleTree.data)
      }
    } catch (error) {
      logger.error(error)
    }
  }

  const onMove: MoveHandler<T> = async (args) => {
    if (!args.parentId) {
      return
    }
    for (const id of args.dragIds) {
      simpleTree.move({ id, parentId: args.parentId, index: args.index })
    }
    if (options?.onTreeChange) {
      options.onTreeChange(simpleTree.data)
    }
  }

  const onRename: RenameHandler<T> = async (args) => {
    const newNode = args.node.data.isCreated
    try {
      if (newNode) {
        let databaseId = 0
        if (options?.onBeforeCreate) {
          const response = await options.onBeforeCreate({
            parentId: args.node.parent?.data.databaseId ?? null,
            name: args.name,
            node: args.node,
          })
          databaseId = +response!.id
        }

        args.node.data.isCreated = false

        simpleTree.update({
          id: args.id,
          changes: {
            name: args.name,
            databaseId,
            isCreated: false,
          } as unknown as Partial<T>,
        })

        if (options?.onTreeChange) {
          await options.onTreeChange(simpleTree.data)
        }
      } else if (!newNode) {
        console.log('onRename', args.node)
        if (options?.onBeforeRename) {
          await options.onBeforeRename(args)
        }

        simpleTree.update({
          id: args.id,
          changes: {
            name: args.name,
          } as Partial<T>,
        })

        if (options?.onTreeChange) {
          await options.onTreeChange(simpleTree.data)
        }
      }
    } catch {
      if (newNode) {
        simpleTree.drop({ id: args.id })
      }
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
        if (focusedNode.isInternal && focusedNode.isOpen) {
          tree.focus(focusedNode)
        } else if (focusedNode.isInternal) {
          tree.open(focusedNode.id)
        }
        break
      case 'ArrowLeft': {
        const node = tree.focusedNode
        if (!node || node.isRoot) {
          return
        }
        if (node.isInternal && node.isOpen) {
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
        focusedNode?.edit()
        break
    }

    if (options?.onKeyDown) {
      options.onKeyDown(event)
    }
  }

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  return {
    data: simpleTree.data,
    attachTree,
    onCreate,
    onRename,
    onDelete,
    onMove,
    onKeyDown,
  }
}
