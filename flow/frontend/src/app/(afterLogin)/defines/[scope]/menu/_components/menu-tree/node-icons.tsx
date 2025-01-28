import { Button } from '@/app/_components/button'
import { AddIcon, RenameIcon, XIcon } from '@/app/_components/icon'
import type { MenuTreeData } from '@/models/menu'
import { useModalStore } from '@/store/modal'
import type { NodeApi, TreeApi } from 'react-arborist'

type NodeIconProps<T> = {
  tree: TreeApi<T>
  node: NodeApi<T>
}

export function NodeIcons<T extends MenuTreeData>({
  tree,
  node,
}: NodeIconProps<T>) {
  const openModal = useModalStore((state) => state.openModal)

  const handleAdd = () => {
    const hasCreated = node.children?.some((child) => child.data.isCreated)
    if (hasCreated) {
      return
    }
    tree.create({ parentId: node.id })
  }

  return (
    <>
      <Button
        className="invisible h-5 w-5 group-hover:visible"
        title="Add"
        variant="ghost"
        size="icon"
        onClick={handleAdd}
      >
        <AddIcon />
      </Button>
      <Button
        className="invisible h-5 w-5 group-hover:visible"
        title="Rename..."
        variant="ghost"
        size="icon"
        onClick={() => node.edit()}
      >
        <RenameIcon />
      </Button>
      {node.level !== 0 && (
        <Button
          className="invisible h-5 w-5 group-hover:visible"
          title="Delete"
          variant="ghost"
          size="icon"
          onClick={() => openModal('confirm-modal', null)}
        >
          <XIcon />
        </Button>
      )}
    </>
  )
}
