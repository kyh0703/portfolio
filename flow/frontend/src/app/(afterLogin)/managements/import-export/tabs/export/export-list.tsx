'use client'

import Grid from '@/app/_components/grid'
import useGridHook from '@/hooks/aggrid/use-grid-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import {
  ColDef,
  GridReadyEvent,
  SelectionChangedEvent,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'

type ExportListProps = {
  data: { id: number | string; name: string }[]
  selectedIds: (number | string)[]
  onSelectedChanged?: (ids: (number | string)[]) => void
}

type ColDefsType = { id: number; name: string }

const colDefs: ColDef<ColDefsType>[] = [
  { field: 'id', hide: true },
  {
    headerName: 'File Name',
    field: 'name',
    filter: false,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    rowDrag: false,
  },
]

export default function ExportList({
  data,
  selectedIds,
  onSelectedChanged,
}: ExportListProps) {
  const gridRef = useRef<AgGridReact<ColDefsType>>(null)
  const gridOptions = useGridOption<ColDefsType>()
  const { getSelectedRows } = useGridHook<ColDefsType>(gridRef)

  const handleSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = getSelectedRows()
    if (!selectedRows) return
    const newSelectedRowIds = selectedRows.map((row) => row.data!.id)
    onSelectedChanged && onSelectedChanged(newSelectedRowIds)
  }

  const onGridReady = (params: GridReadyEvent<ColDefsType>) => {
    const api = params.api

    api.forEachNode((node) => {
      if (selectedIds.includes((node.data as ColDefsType).id)) {
        node.setSelected(true)
      }
    })
  }

  return (
    <Grid
      ref={gridRef}
      gridOptions={gridOptions}
      columnDefs={colDefs}
      rowData={data}
      rowDragManaged={true}
      pagination={false}
      suppressRowClickSelection={true}
      onGridReady={onGridReady}
      onSelectionChanged={handleSelectionChanged}
    />
  )
}
