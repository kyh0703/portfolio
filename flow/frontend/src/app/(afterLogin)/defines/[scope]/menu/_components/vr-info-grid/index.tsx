'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import { Button } from '@/app/_components/button'
import FormGrid from '@/app/_components/form-grid'
import { AddIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridHook from '@/hooks/aggrid/use-grid-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import type { DefineMenu, GramList } from '@/models/define'
import type { CodeData } from '@/models/define/common'
import { useModalStore } from '@/store/modal'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import VRInfoModal from '../vr-info-modal'

const colDefs: ColDef<GramList>[] = [
  {
    headerName: 'Grammer',
    field: 'gram',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'Description',
    field: 'desc',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function VRInfoGrid() {
  const { control } = useFormContext<DefineMenu>()
  const gridRef = useRef<AgGridReact<GramList>>(null)

  const openModal = useModalStore((state) => state.openModal)
  const gridOptions = useGridOption<GramList>()
  const {
    getSelectedRow,
    addRow,
    updateRowByRowIndex,
    cut,
    copy,
    paste,
    remove,
    onKeyDown,
  } = useGridHook<GramList>(gridRef)
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData] = useState<GramList[]>([])

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<CodeData>) => {
    openModal('property-modal', {
      mode: 'update',
      data: {
        ...event.data,
        name: event.data!.name.replace(/\*$/, ''),
      },
    })
  }

  const handleSubmit = (mode: 'create' | 'update', data: GramList) => {
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
      <Modal id="form-modal" title="Edit Chat Detail Code">
        <VRInfoModal onSubmit={handleSubmit} />
      </Modal>
      <div className="flex items-center justify-between">
        <h3>Expression Code Detail</h3>
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
          name="vrInfo.gramList"
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
