'use client'

import { Button } from '@/app/_components/button'
import Grid from '@/app/_components/grid'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import { useDownloadManage } from '@/services/manage'
import { useQueryExports } from '@/services/manage/queries/use-query-exports'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'

export default function DownloadTab() {
  const colDefs: ColDef<string>[] = [
    {
      headerName: 'File Name',
      valueGetter: (params) => params.data,
      valueSetter: (params) => {
        params.data = params.newValue
        return true
      },
      flex: 7,
      filter: false,
      suppressHeaderMenuButton: false,
      suppressHeaderFilterButton: false,
      rowDrag: false,
    },
    {
      cellStyle: { textAlign: 'right' },
      flex: 3,
      cellRendererSelector: (params) => {
        return {
          component: ButtonComponent,
          params: {
            onClick: () => handleDownload(params.data),
          },
        }
      },
    } as ColDef,
  ]

  const anchorRef = useRef<HTMLAnchorElement>(null)
  const gridRef = useRef<AgGridReact<string>>(null)
  const gridOptions = useGridOption<string>()

  const { mutateAsync: downloadMutation } = useDownloadManage()

  const { data } = useSuspenseQuery(useQueryExports())

  const handleDownload = async (fileName: string) => {
    const blob = await downloadMutation(fileName)

    if (blob) {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)
    }
  }

  return (
    <div className="flex h-full w-full flex-col p-6">
      <Grid
        ref={gridRef}
        gridOptions={gridOptions}
        columnDefs={colDefs}
        rowData={data}
        rowDragManaged={false}
        pagination={false}
      />
      <a ref={anchorRef} className="hidden" />
    </div>
  )
}

function ButtonComponent(
  props: ICellRendererParams & {
    onClick: () => void
  },
) {
  return (
    <Button className="h-8" onClick={() => props.onClick()}>
      Download
    </Button>
  )
}
