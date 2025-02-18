'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import { Button } from '@/app/_components/button'
import Grid from '@/app/_components/grid'
import { AddIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import { ArgumentInfo } from '@/models/property/common'
import { useModalStore } from '@/store/modal'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'
import ArgumentInfoModal from './argument-info-modal'

const colDefs: ColDef<string>[] = [
  {
    headerName: 'Name',
    valueGetter: (params) => params.data,
    valueSetter: (params) => {
      params.data = params.newValue
      return true
    },
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
]

export default function BeginnerOutputTab(props: NodePropertyTabProps) {
  const { getValues, setValue } = useNodePropertiesContext()
  const output = getValues(props.tabName) as ArgumentInfo | undefined

  const openModal = useModalStore((state) => state.openModal)
  const gridRef = useRef<AgGridReact<string>>(null)
  const gridOptions = useGridOption<string>()
  const {
    rowData,
    getRows,
    addRow,
    updateRowByRowIndex,
    onRowDragEnd,
    onKeyDown,
    copy,
    cut,
    paste,
    remove,
  } = useGridNodeHook<string>(gridRef, {
    data: output?.arg,
    onRowChanged: () => {
      setValue('output.arg', getRows())
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<string>) => {
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (payload: {
    mode: 'create' | 'update'
    data: string
    rowIndex?: number
  }) => {
    const { mode, data, rowIndex } = payload
    if (mode === 'create') {
      addRow(data)
    } else {
      updateRowByRowIndex(data, rowIndex)
    }
  }

  const handleContextMenuClick = (item: string) => {
    const actions: Record<string, () => void> = {
      delete: remove,
      cut: cut,
      copy: copy,
      paste: paste,
    }
    actions[item]?.()
  }

  return (
    <div className="flex h-full w-full flex-col">
      {contextMenu && (
        <GridContextMenu
          {...contextMenu}
          onItemClick={handleContextMenuClick}
          onClick={() => setContextMenu(null)}
        />
      )}
      <Modal id="property-modal" title="Argument">
        <ArgumentInfoModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div className="flex h-full flex-col space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h3>Argument</h3>
          <Button
            className="p-0"
            variant="ghost"
            size="icon"
            onClick={() => openModal('property-modal', { mode: 'create' })}
          >
            <AddIcon size={20} />
          </Button>
        </div>
        <div className="flex-grow">
          <Grid
            ref={gridRef}
            gridOptions={gridOptions}
            columnDefs={colDefs}
            rowData={rowData}
            rowDragManaged={true}
            pagination={false}
            onRowDoubleClicked={handleRowDoubleClicked}
            onRowDragEnd={onRowDragEnd}
            onKeyDown={onKeyDown}
            onCellContextMenu={onCellContextMenu}
          />
        </div>
      </div>
    </div>
  )
}
