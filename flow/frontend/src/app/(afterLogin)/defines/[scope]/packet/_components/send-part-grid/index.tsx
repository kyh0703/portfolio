'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import FormGrid from '@/app/_components/form-grid'
import { Modal } from '@/app/_components/modal'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridHook from '@/hooks/aggrid/use-grid-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import { DefinePacket, type PacketFormat } from '@/models/define'
import { useModalStore } from '@/store/modal'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import SendModal from '../send-modal'

const colDefs: ColDef<PacketFormat>[] = [
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
    headerName: 'Fill',
    field: 'fill',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Align',
    field: 'align',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Default',
    field: 'default',
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
    headerName: 'Description',
    field: 'desc',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Encryption',
    field: 'encrypt',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  { field: 'numeric', hide: true },
  { field: 'pattern', hide: true },
  { field: 'trim', hide: true },
  { field: 'encode', hide: true },
  { field: 'respCode', hide: true },
]

export default function SendPartGrid() {
  const { control } = useFormContext<DefinePacket>()
  const openModal = useModalStore((state) => state.openModal)

  const gridRef = useRef<AgGridReact<PacketFormat>>(null)
  const gridOptions = useGridOption<PacketFormat>()
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
  } = useGridHook<PacketFormat>(gridRef)
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData] = useState<PacketFormat[]>([])

  const watchTrim = useWatch({ control, name: 'trim' })

  useEffect(() => {
    const rows = getRows()
    rows.forEach((row) => (row.trim = watchTrim))
    setRows(rows)
  }, [getRows, setRows, watchTrim])

  const handleRowDoubleClicked = (
    event: RowDoubleClickedEvent<PacketFormat>,
  ) => {
    openModal('form-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (mode: 'create' | 'update', data: PacketFormat) => {
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
      <Modal id="form-modal" title="Edit Packet Field - Send Part">
        <SendModal onSubmit={handleModalSubmit} />
      </Modal>
      <FormGrid
        ref={gridRef}
        control={control}
        name="sndPart"
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
