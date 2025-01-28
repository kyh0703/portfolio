'use client'

import { useQueryCommonFlowInFlow, useQuerySubFlows } from '@/services/flow'
import { useAddSnapshot } from '@/services/snapshot'
import { useBuildStore } from '@/store/build'
import { useUserContext } from '@/store/context'
import { useFlowTabStore } from '@/store/flow-tab'
import { useManagementStore } from '@/store/management'
import { useSubFlowStore } from '@/store/sub-flow'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/ui/resiable'
import { Separator } from '@/ui/separator'
import { useSuspenseQueries } from '@tanstack/react-query'
import { ReactFlowProvider } from '@xyflow/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useShallow } from 'zustand/react/shallow'
import BlockingOverlay from '../blocking-overlay'
import FlowPanel from '../flow-panel'
import FlowTabs from '../flow-tabs'
import NodeProperty from '../node-property'

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
  const { id: flowId } = useUserContext()
  const useSnapshot = useManagementStore(
    useShallow((state) => state.useSnapshot),
  )
  const [isBuilding, isCompiling] = useBuildStore(
    useShallow((state) => [state.build.isBuilding, state.compile.isCompiling]),
  )
  const [initializeTab, isOpenTab, openTab] = useFlowTabStore((state) => [
    state.initializeTab,
    state.isOpenTab,
    state.openTab,
  ])
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

  const addSnapshotMutation = useAddSnapshot()

  useEffect(() => {
    if (subFlow) {
      if (!isOpenTab(flowId, subFlow) && useSnapshot) {
        addSnapshotMutation.mutate(subFlowId)
      }
      openTab(flowId, subFlow)
    } else {
      toast.error(`SubFlow with id ${subFlowId} not found`)
      const id = initializeTab(flowId, subFlows)
      router.push(`/subflows/${id}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    flowId,
    isOpenTab,
    initializeTab,
    openTab,
    router,
    subFlow,
    subFlowId,
    subFlows,
    useSnapshot,
  ])

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
              <FlowPanel subFlowId={subFlowId} focusNode={focusNode} />
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
