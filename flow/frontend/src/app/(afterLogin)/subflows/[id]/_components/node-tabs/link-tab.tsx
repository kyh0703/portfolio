'use client'

import Grid from '@/app/_components/grid'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import { useEdges, useNodes, useUndoRedo } from '@/hooks/xyflow'
import { Link } from '@/models/property/flow'
import { useRemoveEdges } from '@/services/subflow'
import logger from '@/utils/logger'
import { useReactFlow, type AppEdge, type AppNode } from '@xyflow/react'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEventHandler,
} from 'react'
import { NodePropertyTabProps } from '../node-property/types'

const colDefs: ColDef<Link>[] = [
  { headerName: 'Link Name', field: 'condition' },
  { headerName: 'Target Node', field: 'target' },
]

export default function LinkTab(props: NodePropertyTabProps) {
  const { subFlowId, nodeId } = props

  const gridRef = useRef<AgGridReact<Link>>(null)
  const gridOptions = useGridOption<Link>()
  const { removeSelectedRows, getSelectedRows } = useGridNodeHook<Link>(gridRef)

  const { deleteElements } = useReactFlow<AppNode, AppEdge>()
  const { focusingNode } = useNodes()
  const { syncSaveHistory } = useUndoRedo(subFlowId)
  const { getEdgesBySource } = useEdges()

  const edges = getEdgesBySource(nodeId)
  const [rowData, setRowData] = useState<Link[]>([])

  const { mutateAsync: removeEdgesMutate } = useRemoveEdges()

  useEffect(() => {
    setRowData(
      edges.map((edge) => ({
        condition: edge.data?.condition || '',
        target: edge.target,
      })),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<Link>) => {
    focusingNode(event.data!.target)
  }

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    async (event) => {
      event.preventDefault()
      event.stopPropagation()

      switch (event.key) {
        case 'Delete':
          const deleteRows = getSelectedRows()
          if (!deleteRows) {
            return
          }

          try {
            removeSelectedRows()

            const deleteTargetNodes = deleteRows.map((row) => row.data!.target)
            const deleteEdges = edges.filter((edge) =>
              deleteTargetNodes.includes(edge.target!),
            )
            if (deleteEdges.length === 0) {
              return
            }

            await syncSaveHistory('delete', [], deleteEdges)
            await removeEdgesMutate(
              deleteEdges.map((edge) => ({ id: edge.data!.databaseId! })),
            )
            deleteElements({ edges: deleteEdges })
          } catch (error) {
            logger.error('Error removing edge', error)
          }
          break
        default:
          break
      }
    },
    [
      deleteElements,
      edges,
      getSelectedRows,
      removeEdgesMutate,
      removeSelectedRows,
      syncSaveHistory,
    ],
  )

  return (
    <div className="flex h-full w-full flex-col p-6">
      <Grid
        ref={gridRef}
        gridOptions={gridOptions}
        columnDefs={colDefs}
        rowData={rowData}
        rowDragManaged={true}
        pagination={false}
        suppressContextMenu={true}
        onRowDoubleClicked={handleRowDoubleClicked}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
