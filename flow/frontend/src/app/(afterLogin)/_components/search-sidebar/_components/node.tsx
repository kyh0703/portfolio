import { Button } from '@/app/_components/button'
import CustomTooltip from '@/app/_components/tooltip'
import type {
  DefineData,
  MenuData,
  PropertyData,
  SearchTreeData,
} from '@/models/web-socket/search/types'
import { useSearchStore } from '@/store/search'
import { cn } from '@/utils/cn'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ReplaceIcon,
  XIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { NodeRendererProps } from 'react-arborist'
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
  const [search, replace, useMatchCase, isOpenReplace, highlightText] =
    useSearchStore(
      useShallow((state) => [
        state.search,
        state.replace,
        state.useMatchCase,
        state.isOpenReplace,
        state.highlightText,
      ]),
    )

  const handleMove = () => {
    switch (node.data.itemType) {
      case 'property':
        const { path, subFlowId, nodeName } = node.data as PropertyData
        const nodeId = nodeName
        const tabName = path.split('.')[0]
        router.push(
          `/subflows/${subFlowId}?focusNode=${nodeId}&focusTab=${tabName}`,
        )
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
            router.push(`/defines/${scope}/${defineType}`)
            break
          case 'packet':
          case 'intent':
          case 'cdr':
          case 'string':
          case 'menustat':
            router.push(`/defines/${scope}/${defineType}/${defineId}`)
            break
        }
        break
      case 'menu':
        const { rootId } = node.data as MenuData
        router.push(`/defines/global/menu/${rootId}`)
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
        'flex items-center justify-between gap-1',
        'pr-1',
        'overflow-hidden',
        node.isSelected && 'bg-blue-500 text-white group-focus:bg-blue-600',
      )}
      style={style}
      onClick={() => {
        node.isInternal && node.toggle()
        node.isLeaf && handleMove()
      }}
    >
      <div className="my-1 flex items-center overflow-hidden text-ellipsis pl-3">
        {node.isInternal && (
          <Button className={cn('h-5 w-5')} variant="link" size="icon">
            {node.isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </Button>
        )}
        {node.isInternal ? (
          node.data.name
        ) : (
          <CustomTooltip
            triggerChild={
              <span className="grow overflow-hidden text-ellipsis text-nowrap">
                {node.isLeaf && node.data.origin ? (
                  <HighlightText
                    text={node.data.name}
                    search={highlightText}
                    useMatchCase={useMatchCase}
                    replace={isOpenReplace ? replace : undefined}
                  />
                ) : (
                  node.data.name
                )}
              </span>
            }
            contentChild={tooltip}
          />
        )}
      </div>
      <div className="flex items-center">
        {isOpenReplace && replace && (
          <Button
            className="hidden h-5 w-5 p-1 group-hover:flex"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              const regex = new RegExp(search, useMatchCase ? 'g' : 'gi')
              node.submit(node.data.origin.replaceAll(regex, replace))
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
