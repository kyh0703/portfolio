'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import { Button } from '@/app/_components/button'
import FormGrid from '@/app/_components/form-grid'
import { AddIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridHook from '@/hooks/aggrid/use-grid-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import { type EntityList, type MentList } from '@/models/define'
import { useModalStore } from '@/store/modal'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import MentModal from '../ment-modal'

const colDefs: ColDef<MentList>[] = [
  {
    headerName: 'Kind',
    field: 'kind',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'Expression',
    field: 'expression',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Type',
    field: 'type',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Condition',
    field: 'condition',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  { field: 'ttsInfo', hide: true },
  { field: 'clearDigit', hide: true },
  { field: 'ignoreDtmf', hide: true },
  { field: 'tracking', hide: true },
]

export default function MentGrid() {
  const { control } = useFormContext<EntityList>()
  const gridRef = useRef<AgGridReact<MentList>>(null)

  const openModal = useModalStore((state) => state.openModal)
  const gridOptions = useGridOption<MentList>()
  const {
    getSelectedRow,
    addRow,
    updateRowByRowIndex,
    cut,
    copy,
    paste,
    remove,
    onKeyDown,
  } = useGridHook<MentList>(gridRef)
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData] = useState<MentList[]>([])

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<MentList>) => {
    openModal('property-modal', {
      mode: 'update',
      data: {
        ...event.data,
      },
    })
  }

  const handleSubmit = (mode: 'create' | 'update', data: MentList) => {
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
      <Modal id="form-modal" title="Edit Ment">
        <MentModal onSubmit={handleSubmit} />
      </Modal>
      <div className="flex items-center justify-between">
        <h3>Expression Ment</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => openModal('form-modal', { mode: 'create' })}
        >
          <AddIcon width={20} height={20} />
        </Button>
      </div>
      <div className="flex-1">
        <FormGrid
          ref={gridRef}
          control={control}
          name="mentInfo.ment"
          gridOptions={gridOptions}
          columnDefs={colDefs}
          rowData={rowData}
          rowDragManaged={true}
          pagination={false}
          onRowDoubleClicked={handleRowDoubleClicked}
          onCellContextMenu={onCellContextMenu}
          onKeyDown={onKeyDown}
        />
      </div>
    </>
  )
}
