'use client'

import { useOptionsStateSynced } from '@/hooks/use-options-state-synced'
import type { SubFlowList } from '@/models/subflow-list'
import {
  useAddSnapshot,
  useQueryEdges,
  useQueryNodes,
} from '@/services/subflow'
import { useUserContext } from '@/store/context'
import { useFlowTabStore } from '@/store/flow-tab'
import { toAppEdge, toAppNode } from '@/utils/xyflow/convert'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useEffect } from 'react'
import FlowMain from '../flow-main'

type FlowPanelProps = {
  subFlow: SubFlowList
  focusNode?: string
}

export default function FlowPanel({ subFlow, focusNode }: FlowPanelProps) {
  const { id: flowId, mode: flowMode } = useUserContext()
  const [options] = useOptionsStateSynced()
  const [isOpenTab, openTab] = useFlowTabStore((state) => [
    state.isOpenTab,
    state.openTab,
  ])
  const addSnapshotMutation = useAddSnapshot()

  const { nodes, edges } = useSuspenseQueries({
    queries: [useQueryNodes(subFlow.id), useQueryEdges(subFlow.id)],
    combine: (results) => ({
      nodes: results[0].data.map((node) => toAppNode(node)),
      edges: results[1].data.map((edge) => toAppEdge(edge)),
    }),
  })

  useEffect(() => {
    if (!isOpenTab(flowId, subFlow.id) && options?.snapShot.use) {
      addSnapshotMutation.mutate(subFlow.id)
    }
    openTab(flowId, subFlow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative h-full">
      <FlowMain
        flowMode={flowMode}
        subFlowId={subFlow.id}
        initialNodes={nodes}
        initialEdges={edges}
        focusNode={focusNode}
      />
    </div>
  )
}
