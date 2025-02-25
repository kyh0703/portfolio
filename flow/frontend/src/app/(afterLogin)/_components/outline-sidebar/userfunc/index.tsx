'use client'

import Grid from '@/app/_components/grid'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import type { DefineUserFunc } from '@/models/define'
import { useQueryDefines } from '@/services/define'
import type { DefineScope } from '@/types/define'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ColDef } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from 'react'

const colDefs: ColDef<UserFuncList>[] = [
  { field: 'id', hide: true },
  { field: 'scope', hide: true },
  { headerName: 'Function Name', field: 'property.name' },
  { headerName: 'Library File', field: 'property.file' },
  { headerName: 'Library Type', field: 'property.type' },
  { headerName: 'Description', field: 'property.desc' },
]

export type UserFuncList = {
  id: number
  scope: DefineScope
  property: DefineUserFunc
}

export default function UserFuncOutline() {
  const gridRef = useRef<AgGridReact<UserFuncList>>(null)
  const gridOptions = useGridOption<UserFuncList>()

  const { data } = useSuspenseQuery({
    ...useQueryDefines<DefineUserFunc>('userfunc'),
    gcTime: 5 * 60 * 1000,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  })

  const [rowData, setRowData] = useState<UserFuncList[]>([])

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
