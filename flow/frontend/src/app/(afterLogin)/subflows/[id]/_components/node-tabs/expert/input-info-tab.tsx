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
import type { InParams, ParameterInfo } from '@/models/property/common'
import { useModalStore } from '@/store/modal'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'
import InputInfoModal from './input-info-modal'
import { NodePropertyTabProps } from '../../node-properties/types'

const colDefs: ColDef<InParams>[] = [
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
    field: 'value',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function InputInfoTab(props: NodePropertyTabProps) {
  const { getValues, setValue } = useNodePropertiesContext()
  const input = getValues('input') as ParameterInfo | undefined

  const { openModal } = useModalStore()

  const gridRef = useRef<AgGridReact<InParams>>(null)
  const gridOptions = useGridOption<InParams>()
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
  } = useGridNodeHook<InParams>(gridRef, {
    data: input?.param,
    onRowChanged: () => {
      setValue('input.param', getRows())
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<InParams>) => {
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    data: InParams,
    rowIndex?: number,
  ) => {
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
        <InputInfoModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div className="flex h-full flex-col space-y-6 p-6">
        <div className="flex items-center justify-between gap-3">
          <h3>Argument</h3>
          <Button
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
