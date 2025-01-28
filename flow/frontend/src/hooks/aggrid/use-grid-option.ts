import { type ColDef, type GridOptions } from 'ag-grid-community'
import { useMemo } from 'react'

export default function useGridOption<T>() {
  const defaultColDef: ColDef<T> = useMemo(
    () => ({
      flex: 1,
      resizable: true,
      sortable: false,
      editable: false,
      filter: true,
      floatingFilter: false,
    }),
    [],
  )

  const gridOptions: GridOptions<T> = useMemo(
    () => ({
      defaultColDef,
      editType: 'fullRow',
      onRowEditingStarted: (params) => {
        params.api.refreshCells({
          columns: ['action'],
          rowNodes: [params.node],
          force: true,
        })
      },
      onRowEditingStopped: (params) => {
        params.api.refreshCells({
          columns: ['action'],
          rowNodes: [params.node],
          force: true,
        })
      },
      suppressClickEdit: true,
      suppressCopySingleCellRanges: true,
      suppressMoveWhenRowDragging: true,
      preventDefaultOnContextMenu: true,
      rowSelection: 'multiple',
      animateRows: true,
      pagination: true,
      tooltipShowDelay: 0,
      tooltipHideDelay: 2000,
      enableRangeSelection: false,
      copyHeadersToClipboard: true,
    }),
    [defaultColDef],
  )

  return gridOptions
}
