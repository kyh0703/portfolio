'use client'

import { useQueryEdges, useQueryNodes } from '@/services/subflow'
import { toAppEdge, toAppNode } from '@/utils/xyflow/convert'
import { useSuspenseQueries } from '@tanstack/react-query'
import FlowMain from '../flow-main'

type FlowPanelProps = {
  subFlowId: number
  focusNode?: string
}

export default function FlowPanel({ subFlowId, focusNode }: FlowPanelProps) {
  const { nodes, edges } = useSuspenseQueries({
    queries: [useQueryNodes(subFlowId), useQueryEdges(subFlowId)],
    combine: (results) => ({
      nodes: results[0].data.map((node) => toAppNode(node)),
      edges: results[1].data.map((edge) => toAppEdge(edge)),
    }),
  })

  return (
    <div className="relative h-full">
      <FlowMain
        subFlowId={subFlowId}
        initialNodes={nodes}
        initialEdges={edges}
        focusNode={focusNode}
      />
    </div>
  )
}
