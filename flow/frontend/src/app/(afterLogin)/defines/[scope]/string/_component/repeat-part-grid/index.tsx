'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import FormGrid from '@/app/_components/form-grid'
import { Modal } from '@/app/_components/modal'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridHook from '@/hooks/aggrid/use-grid-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import type { DefineString, StringFormat } from '@/models/define'
import { useModalStore } from '@/store/modal'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import RepeatModal from '../repeat-modal'

const colDefs: ColDef<StringFormat>[] = [
  {
    headerName: 'Type',
    field: 'type',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'Name',
    field: 'name',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Len',
    field: 'length',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Count Name',
    field: 'cntName',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Trim',
    field: 'trim',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Description',
    field: 'desc',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function RepeatPartGrid() {
  const { control } = useFormContext<DefineString>()
  const openModal = useModalStore((state) => state.openModal)

  const gridOptions = useGridOption<StringFormat>()
  const gridRef = useRef<AgGridReact<StringFormat>>(null)
  const {
    getSelectedRow,
    getRows,
    setRows,
    addRow,
    updateRowByRowIndex,
    cut,
    copy,
    paste,
    remove,
    onKeyDown,
  } = useGridHook<StringFormat>(gridRef)
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData] = useState<StringFormat[]>([])

  const watchTrim = useWatch({ control, name: 'trim' })

  useEffect(() => {
    const rows = getRows()
    rows.forEach((row) => (row.trim = watchTrim))
    setRows(rows)
  }, [getRows, setRows, watchTrim])

  const handleRowDoubleClicked = (
    event: RowDoubleClickedEvent<StringFormat>,
  ) => {
    openModal('form-modal', {
      mode: 'update',
      rows: [],
      repeat: [],
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (mode: 'create' | 'update', data: StringFormat) => {
    if (mode === 'create') {
      addRow(data)
    } else {
      updateRowByRowIndex(data, getSelectedRow()?.rowIndex)
    }
  }

  const handleContextMenuClick = async (item: string) => {
    const actions: Record<string, () => void> = {
      delete: remove,
      cut: cut,
      copy: copy,
      paste: paste,
    }
    actions[item]?.()
  }

  return (
    <>
      {contextMenu && (
        <GridContextMenu
          {...contextMenu}
          onItemClick={handleContextMenuClick}
          onClick={() => setContextMenu(null)}
        />
      )}
      <Modal id="form-modal" title="Edit String Field - Repeat Part">
        <RepeatModal onSubmit={handleModalSubmit} />
      </Modal>
      <FormGrid
        ref={gridRef}
        control={control}
        name="rptPart"
        gridOptions={gridOptions}
        columnDefs={colDefs}
        rowData={rowData}
        rowDragManaged={true}
        pagination={false}
        onRowDoubleClicked={handleRowDoubleClicked}
        onCellContextMenu={onCellContextMenu}
        onKeyDown={onKeyDown}
      />
    </>
  )
}
