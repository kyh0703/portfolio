import {
  BottomArrowIcon,
  FileMenuIcon,
  FileSubIcon,
} from '@/app/_components/icon'
import type { MenuTreeData } from '@/models/menu'
import type { NodeRendererProps } from 'react-arborist'
import { twJoin } from 'tailwind-merge'
import { NodeIcons } from './node-icons'
import { NodeName } from './node-name'

export default function Node({
  style,
  node,
  tree,
  dragHandle,
}: NodeRendererProps<MenuTreeData>) {
  return (
    <section
      ref={dragHandle}
      className={twJoin(
        'group flex h-full w-full cursor-pointer items-center rounded',
        node.state.isSelected && 'bg-accent',
        node.state.isFocused && 'bg-blue-600 text-white',
      )}
      style={style}
    >
      <div onClick={() => node.isInternal && node.toggle()}>
        <BottomArrowIcon
          className={node.isOpen ? '-rotate-90' : 'rotate-0'}
          width={20}
          height={20}
        />
      </div>
      <div className="flex h-full w-full items-center">
        {node.isLeaf ? (
          <div className="flex items-center">
            <FileSubIcon />
          </div>
        ) : (
          <div className="flex items-center">
            <FileMenuIcon />
          </div>
        )}
        <NodeName tree={tree} node={node} />
      </div>
      <div className="mr-3 flex items-center gap-1">
        <NodeIcons tree={tree} node={node} />
      </div>
    </section>
  )
}
