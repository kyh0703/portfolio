'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import { Button } from '@/app/_components/button'
import FormGrid from '@/app/_components/form-grid'
import { AddIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridHook from '@/hooks/aggrid/use-grid-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import type { DefineMenu } from '@/models/define'
import type { CodeData } from '@/models/define/common'
import { useModalStore } from '@/store/modal'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import ChatModal from '../chat-modal'

const colDefs: ColDef<CodeData>[] = [
  {
    headerName: 'Name',
    field: 'name',
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
    headerName: 'Condition',
    field: 'condition',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function ChatGrid({ tabValue }: { tabValue: number }) {
  const { control, getValues } = useFormContext<DefineMenu>()

  const openModal = useModalStore((state) => state.openModal)
  const gridRef = useRef<AgGridReact<CodeData>>(null)
  const gridOptions = useGridOption<CodeData>()
  const {
    getSelectedRow,
    addRow,
    setRows,
    updateRowByRowIndex,
    cut,
    copy,
    paste,
    remove,
    onKeyDown,
  } = useGridHook<CodeData>(gridRef)
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData] = useState<CodeData[]>([])

  useEffect(() => {
    const codeData = getValues(`chat.output.category.${tabValue}.codeData`)
    setRows(codeData)
  }, [getValues, setRows, tabValue])

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<CodeData>) => {
    openModal('property-modal', {
      mode: 'update',
      data: {
        ...event.data,
        name: event.data!.name.replace(/\*$/, ''),
      },
    })
  }

  const handleSubmit = (mode: 'create' | 'update', data: CodeData) => {
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
        <ChatModal onSubmit={handleSubmit} />
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
          name={`chat.output.category.${tabValue}.codeData`}
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
