'use client'

import Spinner from '@/app/_components/spinner'
import { useSubFlowStore } from '@/store/sub-flow'
import { Suspense } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { hasPropertyNode } from '../flow-main/tools'
import { NodePropertyTypes, type NodePropertyKey } from './types'

export default function NodeProperty({
  subFlowId,
  focusTab,
}: {
  subFlowId: number
  focusTab?: string
}) {
  const selectedNode = useSubFlowStore(
    useShallow((state) => state.history[subFlowId]?.selectedNode),
  )
  if (!selectedNode) {
    return null
  }

  if (!hasPropertyNode(selectedNode.nodeType)) {
    return null
  }

  const PropertyComponent =
    NodePropertyTypes[selectedNode.nodeType as NodePropertyKey]

  const combinedProps = { ...selectedNode, focusTab, tabName: '' }

  return (
    <aside className="relative flex h-full w-full overflow-hidden bg-background text-foreground">
      <Suspense fallback={<Spinner />}>
        <PropertyComponent {...combinedProps} />
      </Suspense>
    </aside>
  )
}
