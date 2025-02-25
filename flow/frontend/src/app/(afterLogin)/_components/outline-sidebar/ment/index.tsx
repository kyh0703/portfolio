'use client'

import Grid from '@/app/_components/grid'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import type { DefineMent } from '@/models/define'
import { useQueryDefines } from '@/services/define'
import type { DefineScope } from '@/types/define'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ColDef } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from 'react'

const colDefs: ColDef<MentList>[] = [
  { field: 'id', hide: true },
  { field: 'scope', hide: true },
  { headerName: 'ID', field: 'property.id', minWidth: 100 },
  { headerName: 'File', field: 'property.file', minWidth: 100 },
  { headerName: 'Description', field: 'property.desc', minWidth: 200 },
]

type MentList = {
  id: number
  scope: DefineScope
  property: DefineMent
}

export default function MentOutline() {
  const gridRef = useRef<AgGridReact<MentList>>(null)
  const gridOptions = useGridOption<MentList>()

  const { data } = useSuspenseQuery({
    ...useQueryDefines<DefineMent>('ment'),
    gcTime: 5 * 60 * 1000,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  })

  const [rowData, setRowData] = useState<MentList[]>([])

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
