import { SearchTreeData } from '@/models/web-socket/search/types'
import { useSearchStore } from '@/store/search'
import { useEffect, useRef } from 'react'
import { SimpleTree } from 'react-arborist'
import { useShallow } from 'zustand/react/shallow'

export type CustomCreateHandler = (args: {
  parentId: string | null
  index: number
  data: SearchTreeData
}) => (SearchTreeData | null) | Promise<SearchTreeData | null>

export type CustomRenameHandler = (args: {
  id: string
  name: string
}) => void | Promise<void>

type CustomDeleteHandler = (args: { ids: string[] }) => void | Promise<void>

export function useTree() {
  const [data, setData] = useSearchStore(
    useShallow((state) => [state.data, state.setData]),
  )
  const treeRef = useRef(new SimpleTree<SearchTreeData>(data))

  useEffect(() => {
    treeRef.current = new SimpleTree<SearchTreeData>(data)
  }, [data])

  const onCreate: CustomCreateHandler = async ({ parentId, index, data }) => {
    const tree = treeRef.current
    if (tree) {
      tree.create({ parentId, index, data })
      setData(tree.data)
    }
    return data
  }
  const onDelete: CustomDeleteHandler = (args: { ids: string[] }) => {
    const tree = treeRef.current
    if (!tree) return

    args.ids.forEach((id) => tree.drop({ id }))
    setData(tree.data)
  }

  const onFind = (id: string) => treeRef.current.find(id)

  const getIndex = () => {
    return treeRef.current.root.children?.length ?? 0
  }

  const clear = () => {
    const tree = treeRef.current
    if (!tree) return

    tree.data.forEach((node) => tree.drop({ id: node.id }))
    setData(tree.data)
  }

  return {
    data,
    onCreate,
    onDelete,
    onFind,
    clear,
    getIndex,
  } as const
}
