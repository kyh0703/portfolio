'use client'

import SearchBox from '@/app/_components/search-bar'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/ui/resizable'
import { cn } from '@/utils/cn'
import { useState } from 'react'
import CommonFlowTree from './commonflow-tree'
import SubFlowTree from './subflow-tree'

export default function SubFlowSidebar() {
  const [search, setSearch] = useState('')

  return (
    <aside className="flex h-full w-full flex-col">
      <div className="flex h-search w-full flex-shrink-0 items-center justify-center border-b border-solid px-5">
        <SearchBox onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="flex h-full flex-col overflow-hidden">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
            <SubFlowTree search={search} />
          </ResizablePanel>
          <ResizableHandle
            className={cn(
              'data-[panel-group-direction=vertical]:h-1',
              'data-[resize-handle-active]:bg-left-tool',
              'data-[resize-handle-state=hover]:bg-left-tool',
            )}
          />
          <ResizablePanel>
            <CommonFlowTree search={search} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </aside>
  )
}
