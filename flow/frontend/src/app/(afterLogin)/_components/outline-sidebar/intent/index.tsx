'use client'

import Grid from '@/app/_components/grid'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import type { DefineIntent } from '@/models/define'
import { useQueryDefines } from '@/services/define'
import type { DefineScope } from '@/types/define'
import { getDefinePath } from '@/utils/route-path'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const colDefs: ColDef<IntentList>[] = [
  { field: 'id', hide: true },
  { field: 'scope', hide: true },
  { headerName: 'ID', field: 'property.id', minWidth: 100 },
  { headerName: 'Name', field: 'property.name', minWidth: 100 },
  { headerName: 'Action MenuCall', field: 'property.menuCall', minWidth: 200 },
  { headerName: 'Action SubCall', field: 'property.subCall', minWidth: 200 },
]

type IntentList = {
  id: number
  scope: DefineScope
  property: DefineIntent
}

export default function IntentOutline() {
  const router = useRouter()
  const gridRef = useRef<AgGridReact<IntentList>>(null)
  const gridOptions = useGridOption<IntentList>()

  const { data } = useSuspenseQuery({
    ...useQueryDefines<DefineIntent>('intent'),
    gcTime: 5 * 60 * 1000,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  })

  const [rowData, setRowData] = useState<IntentList[]>([])

  useEffect(() => {
    setRowData(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setRowData(data)
  }, [data])

  const handleRowDoubleClick = (event: RowDoubleClickedEvent<IntentList>) => {
    if (!event.data) {
      return
    }
    router.push(getDefinePath(event.data.scope, 'intent', event.data.id))
  }

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
        onRowDoubleClicked={handleRowDoubleClick}
      />
    </div>
  )
}
