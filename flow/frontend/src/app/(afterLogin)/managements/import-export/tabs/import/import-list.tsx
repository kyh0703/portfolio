'use client'

import Grid from '@/app/_components/grid'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import {
  ColDef,
  GridOptions,
  ICellRendererParams,
  RowDataUpdatedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { CircleCheck, CircleDashed, CircleX } from 'lucide-react'
import React, { memo } from 'react'
import { ImportType, StatusType } from '.'

type ImportListType = {
  imports: ImportType[]
  onSelectionChanged: (event: SelectionChangedEvent) => void
}

export const ImportList = React.forwardRef<
  AgGridReact<ImportType>,
  ImportListType
>(({ imports, onSelectionChanged }, ref) => {
  const colDefs: ColDef<string>[] = [
    {
      headerName: 'File Name',
      field: 'file.name',
      filter: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      rowDrag: false,
      flex: 4,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellStyle: { textAlign: 'center' },
      flex: 1,
      cellRenderer: IconRenderer,
    } as ColDef,
    {
      headerName: 'Reason',
      field: 'reason',
      filter: false,
      rowDrag: false,
      flex: 5,
    },
  ]

  const gridOptions: GridOptions<ImportType> = useGridOption<ImportType>()

  const handleRowDataUpdated = (params: RowDataUpdatedEvent) => {
    params.api.forEachNode((node) => {
      node.setSelected(true)
    })
  }

  return (
    <Grid
      ref={ref}
      gridOptions={gridOptions}
      columnDefs={colDefs}
      rowData={imports}
      rowSelection="multiple"
      rowDragManaged={true}
      pagination={false}
      suppressRowClickSelection={true}
      onSelectionChanged={onSelectionChanged}
      onRowDataUpdated={handleRowDataUpdated}
    />
  )
})

ImportList.displayName = 'ImportList'

export default memo(ImportList)

function IconRenderer(params: ICellRendererParams) {
  const iconMap = {
    idle: <CircleDashed className="text-primary" />,
    success: <CircleCheck className="text-success" />,
    fail: <CircleX className="text-error" />,
  }

  const icon = iconMap[params.data.status as StatusType]

  return <div className="flex h-full items-center justify-center">{icon}</div>
}
