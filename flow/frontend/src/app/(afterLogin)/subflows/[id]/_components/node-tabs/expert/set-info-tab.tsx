'use client'

import Autocomplete from '@/app/_components/autocomplete'
import Grid from '@/app/_components/grid'
import { REQUEST_DELAY_TIME } from '@/constants/delay'
import useAutocomplete from '@/hooks/use-autocomplete'
import { useEdges, useNodes } from '@/hooks/xyflow'
import { type GotoList } from '@/models/property/flow'
import { useUpdateNode } from '@/services/subflow'
import { useReactFlow, type AppEdge, type AppNode } from '@xyflow/react'
import { ColDef } from 'ag-grid-community'
import debounce from 'lodash-es/debounce'
import { useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'

const colDefs: ColDef<GotoList>[] = [
  {
    headerName: 'Node ID',
    field: 'nodeId',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Tag Name',
    field: 'tagName',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function SetInfoTab(props: NodePropertyTabProps) {
  const { nodeId } = props
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const { getNode } = useReactFlow<AppNode, AppEdge>()
  const { setLabel } = useNodes()
  const { getEdgesByTarget } = useEdges()
  const node = getNode(nodeId)!
  const edges = getEdgesByTarget(nodeId)

  const [labelName, setLabelName] = useState(node.data.label)
  const [rowData, setRowData] = useState<GotoList[]>(() => {
    return edges.map((edge) => {
      const sourceNode = getNode(edge.source)!
      return {
        nodeId: sourceNode.id,
        tagName: sourceNode.data.label || '',
      }
    })
  })

  const updateNodeMutation = useUpdateNode()

  const fetchLabelName = debounce((label) => {
    updateNodeMutation.mutate(
      {
        nodeId: node.data.databaseId!,
        node: {
          ...node,
          data: { ...node.data, label },
        },
      },
      { onError: () => updateNodeMutation.reset() },
    )
  }, REQUEST_DELAY_TIME)

  const handleLabelNameChange = (name: string, value: string) => {
    setLabelName(value)
    setLabel(nodeId, value)
    fetchLabelName(value)
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>Label Name</h3>
          <Autocomplete
            name="labelInfo.labelName"
            value={labelName}
            options={options}
            onChange={handleLabelNameChange}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>List of GotoLabel Node</h3>
          <div className="h-60">
            <Grid
              columnDefs={colDefs}
              rowData={rowData}
              rowDragManaged={false}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
