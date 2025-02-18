import { Button } from '@/app/_components/button'
import type {
  DefineData,
  MenuData,
  PropertyData,
  SearchTreeData,
} from '@/models/web-socket/search/types'
import { useSearchStore } from '@/store/search'
import { cn } from '@/utils/cn'
import { getDefinePath, getMenuPath, getSubFlowPath } from '@/utils/route-path'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  GlobeIcon,
  MenuIcon,
  NetworkIcon,
  ReplaceIcon,
  XIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PropsWithChildren, useMemo } from 'react'
import { NodeRendererProps } from 'react-arborist'
import { createPortal } from 'react-dom'
import { Tooltip } from 'react-tooltip'
import { useShallow } from 'zustand/react/shallow'
import HighlightText from './highlight-text'
export default function Node<T extends SearchTreeData>({
  node,
  style,
  tree,
}: NodeRendererProps<T>) {
  const tooltip = useMemo(
    () =>
      `${node.data.path.split('.').join(' / ')} / ${node.data.name.split(' / ').pop()}`,
    [node.data.path, node.data.name],
  )
  const router = useRouter()
  const [options, highlightText] = useSearchStore(
    useShallow((state) => [state.options, state.highlightText]),
  )

  const handleMove = () => {
    switch (node.data.itemType) {
      case 'property':
        const { path, subFlowId, nodeName } = node.data as PropertyData
        const nodeId = nodeName
        const tabName = path.split('.')[0]
        router.push(getSubFlowPath(subFlowId, nodeId, tabName))
        break
      case 'define':
        const { defineType, defineId, scope } = node.data as DefineData
        switch (defineType) {
          case 'var':
          case 'ment':
          case 'log':
          case 'userfunc':
          case 'track':
          case 'service':
            router.push(getDefinePath(scope, defineType))
            break
          case 'packet':
          case 'intent':
          case 'cdr':
          case 'string':
          case 'menustat':
            router.push(getDefinePath(scope, defineType, defineId))
            break
        }
        break
      case 'menu':
        const { rootId } = node.data as MenuData
        router.push(getMenuPath(rootId))
        break
    }
  }

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    tree.delete(node.id)
  }

  return (
    <div
      className={cn(
        'group',
        'flex h-full items-center justify-between gap-1',
        'pr-1',
        'overflow-hidden',
        'text-icon hover:font-medium',
        node.isSelected ? 'bg-[#2196F3] font-medium' : 'hover:bg-tree-hover',
      )}
      style={style}
      onClick={() => {
        node.isInternal && node.toggle()
        node.isLeaf && handleMove()
      }}
    >
      <div className="flex items-center space-x-1 overflow-hidden text-ellipsis pl-3">
        {node.isInternal && (
          <>
            <Button className={cn('h-5 w-5')} variant="link" size="icon">
              {node.isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </Button>
            {node.data.itemType === 'property' && <NetworkIcon size={15} />}
            {node.data.itemType === 'define' && <GlobeIcon size={15} />}
            {node.data.itemType === 'menu' && <MenuIcon size={15} />}
          </>
        )}
        {node.isInternal ? (
          <div className="ml-1">{node.data.name}</div>
        ) : (
          <>
            <span
              data-tooltip-id={`search-node-${node.id}`}
              className="grow overflow-hidden text-ellipsis text-nowrap"
            >
              {node.isLeaf && node.level > 0 ? (
                <HighlightText
                  text={node.data.name}
                  search={highlightText}
                  useMatchCase={options.useMatchCase}
                  replace={options.isOpenReplace ? options.replace : undefined}
                />
              ) : (
                node.data.name
              )}
            </span>
            <BodyPortal>
              <Tooltip
                id={`search-node-${node.id}`}
                place="right"
                opacity={1}
                className="max-w-64 bg-tooltip px-2 py-1.5"
                content={tooltip}
              />
            </BodyPortal>
          </>
        )}
      </div>
      <div className="flex items-center">
        {options.isOpenReplace && options.replace && (
          <Button
            className="hidden h-5 w-5 p-1 group-hover:flex"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              const regex = new RegExp(
                options.search,
                options.useMatchCase ? 'g' : 'gi',
              )
              node.submit(node.data.origin.replaceAll(regex, options.replace))
            }}
          >
            <ReplaceIcon />
          </Button>
        )}
        <Button
          className="hidden h-5 w-5 p-1 group-hover:flex"
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
        >
          <XIcon />
        </Button>
      </div>
    </div>
  )
}

function BodyPortal({ children }: PropsWithChildren) {
  return createPortal(children, document.body)
}
