'use client'

import Grid from '@/app/_components/grid'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import type { DefineVar } from '@/models/define'
import { useQueryDefines } from '@/services/define'
import type { DefineScope } from '@/types/define'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ColDef } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from 'react'

const colDefs: ColDef<VarList>[] = [
  { field: 'id', hide: true },
  { field: 'scope', hide: true },
  { headerName: 'Name', field: 'property.name' },
  { headerName: 'Description', field: 'property.desc' },
]

type VarList = {
  id: number
  scope: DefineScope
  property: DefineVar
}

export default function VarOutline() {
  const gridRef = useRef<AgGridReact<VarList>>(null)
  const gridOptions = useGridOption<VarList>()

  const { data } = useSuspenseQuery({
    ...useQueryDefines<DefineVar>('var'),
    gcTime: 5 * 60 * 1000,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  })

  const [rowData, setRowData] = useState<VarList[]>([])

  useEffect(() => {
    setRowData(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setRowData(data)
  }, [data])

  return (
    <div className="flex h-full w-full flex-col p-3">
      <Grid
        ref={gridRef}
        className="text-xs"
        gridOptions={gridOptions}
        columnDefs={colDefs}
        rowData={rowData}
        rowDragManaged={true}
        pagination={false}
      />
    </div>
  )
}
