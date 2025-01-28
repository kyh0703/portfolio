import { Input } from '@/app/_components/input'
import useValidate from '@/hooks/use-validation'
import type { MenuTreeData } from '@/models/menu'
import type { NodeApi, TreeApi } from 'react-arborist'
import { twJoin } from 'tailwind-merge'

type NodeNameProps<T> = {
  tree: TreeApi<T>
  node: NodeApi<T>
}

export function NodeName({ tree, node }: NodeNameProps<MenuTreeData>) {
  const { validateVar } = useValidate()

  const handleBlur = () => {
    if (node.data.isCreated) {
      tree.delete(node.id)
    } else {
      node.reset()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation()
    switch (event.key) {
      case 'Escape':
        if (node.data.isCreated) {
          tree.delete(node.id)
        } else {
          node.reset()
        }
        break
      case 'Enter':
        const name = event.currentTarget.value
        if (!validateVar(name)) {
          break
        }
        node.submit(name)
        break
    }
  }

  return (
    <>
      {node.isEditing ? (
        <Input
          className={twJoin(
            'ml-2 h-5 w-full grow px-1 active:outline-none',
            'text-black focus-visible:rounded-[1px] focus-visible:outline-none focus-visible:ring-offset-0',
          )}
          type="text"
          defaultValue={node.data.name}
          autoFocus
          onFocus={(event) => event.currentTarget.select()}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span className="ml-1 text-nowrap">{node.data.name}</span>
      )}
    </>
  )
}
