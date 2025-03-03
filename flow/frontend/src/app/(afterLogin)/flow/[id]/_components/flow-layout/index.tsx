'use client'

import { useQueryCommonFlowInFlow, useQuerySubFlows } from '@/services/project'
import { useSubFlowStore } from '@/store/flow'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/ui/resizable'
import { Separator } from '@/ui/separator'
import { getSubFlowPath } from '@/utils/route-path'
import { useSuspenseQueries } from '@tanstack/react-query'
import { ReactFlowProvider } from '@xyflow/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useShallow } from 'zustand/react/shallow'
import FlowPanel from '../flow-panel'
import FlowTabs from '../flow-tabs'

type FlowLayoutProps = {
  id: number
  focusNode?: string
  focusTab?: string
}

export default function FlowLayout({ id, focusNode }: FlowLayoutProps) {
  const selectedNode = useSubFlowStore(
    useShallow((state) => state.history[id]?.selectedNode),
  )

  return (
    <ReactFlowProvider>
      <ResizablePanelGroup direction="horizontal" className="relative">
        <ResizablePanel>
          <div className="flex h-full w-full flex-col">
            <div className="flex h-full w-full flex-col">
              <FlowTabs />
              <Separator />
              <FlowPanel focusNode={focusNode} />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle className="w-1 data-[resize-handle-active]:bg-left-tool data-[resize-handle-state=hover]:bg-left-tool" />
        <ResizablePanel
          minSize={30}
          maxSize={50}
          defaultSize={30}
          hidden={!selectedNode}
        ></ResizablePanel>
      </ResizablePanelGroup>
    </ReactFlowProvider>
  )
}
