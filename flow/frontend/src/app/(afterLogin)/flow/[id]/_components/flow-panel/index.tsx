'use client'

import { useQueryEdges, useQueryNodes } from '@/services/flow'
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
  const [isOpenTab, openTab] = useFlowTabStore((state) => [
    state.isOpenTab,
    state.openTab,
  ])

  const { nodes, edges } = useSuspenseQueries({
    queries: [useQueryNodes(subFlow.id), useQueryEdges(subFlow.id)],
    combine: (results) => ({
      nodes: results[0].data.map((node) => toAppNode(node)),
      edges: results[1].data.map((edge) => toAppEdge(edge)),
    }),
  })

  return (
    <div className="relative h-full">
      <FlowMain
        flowId={subFlow.id}
        initialNodes={nodes}
        initialEdges={edges}
        focusNode={focusNode}
      />
    </div>
  )
}
