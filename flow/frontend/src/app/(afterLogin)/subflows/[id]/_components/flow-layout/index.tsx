'use client'

import { useQueryCommonFlowInFlow, useQuerySubFlows } from '@/services/flow'
import { useBuildStore } from '@/store/build'
import { useSubFlowStore } from '@/store/sub-flow'
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
import BlockingOverlay from '../blocking-overlay'
import FlowPanel from '../flow-panel'
import FlowTabs from '../flow-tabs'
import NodeProperty from '../node-properties'

type FlowLayoutProps = {
  subFlowId: number
  focusNode?: string
  focusTab?: string
}

export default function FlowLayout({
  subFlowId,
  focusNode,
  focusTab,
}: FlowLayoutProps) {
  const router = useRouter()
  const [isBuilding, isCompiling] = useBuildStore(
    useShallow((state) => [state.build.isBuilding, state.compile.isCompiling]),
  )
  const selectedNode = useSubFlowStore(
    useShallow((state) => state.history[subFlowId]?.selectedNode),
  )

  const { subFlows, commonFlows } = useSuspenseQueries({
    queries: [useQuerySubFlows(), useQueryCommonFlowInFlow()],
    combine: (results) => ({
      commonFlows: results[1].data.flow,
      subFlows: results[0].data.flow,
    }),
  })

  const subFlow =
    subFlows.find((subFlow) => subFlow.id === subFlowId) ??
    commonFlows.find((item) => item.id === subFlowId)
  if (!subFlow) {
    toast.error(`SubFlow with id ${subFlowId} not found`)
    router.push(getSubFlowPath())
    return null
  }

  return (
    <ReactFlowProvider>
      <ResizablePanelGroup direction="horizontal" className="relative">
        {(isBuilding || isCompiling) && (
          <BlockingOverlay>
            {isBuilding ? 'building...' : 'compiling...'}
          </BlockingOverlay>
        )}
        <ResizablePanel>
          <div className="flex h-full w-full flex-col">
            <div className="flex h-full w-full flex-col">
              <FlowTabs />
              <Separator />
              <FlowPanel subFlow={subFlow} focusNode={focusNode} />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle className="w-1 data-[resize-handle-active]:bg-left-tool data-[resize-handle-state=hover]:bg-left-tool" />
        <ResizablePanel
          minSize={30}
          maxSize={50}
          defaultSize={30}
          hidden={!selectedNode}
        >
          <NodeProperty subFlowId={subFlowId} focusTab={focusTab} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ReactFlowProvider>
  )
}
