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
import type { CdrDataList } from '@/models/property/flow'
import { useModalStore } from '@/store/modal'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'
import type { NodePropertyTabProps } from '../../node-properties/types'
import CdrDataListModal from './cdr-data-list-modal'

const colDefs: ColDef<CdrDataList>[] = [
  {
    headerName: 'Name',
    field: 'name',
    filter: false,
    minWidth: 150,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'Type',
    field: 'type',
    filter: false,
    minWidth: 150,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Expression',
    field: 'expression',
    filter: false,
    minWidth: 150,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Condition',
    field: 'condition',
    filter: false,
    minWidth: 150,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function CdrDataListTab(props: NodePropertyTabProps) {
  const { getValues, setValue } = useNodePropertiesContext()
  const dataList = getValues(props.tabName) as CdrDataList[] | undefined
  const { openModal } = useModalStore()
  const gridRef = useRef<AgGridReact<CdrDataList>>(null)
  const gridOptions = useGridOption<CdrDataList>()
  const {
    rowData,
    getRows,
    addRow,
    updateRowByRowIndex,
    onRowDragEnd,
    onKeyDown,
    cut,
    copy,
    paste,
    remove,
  } = useGridNodeHook<CdrDataList>(gridRef, {
    data: dataList,
    onRowChanged: () => {
      setValue('dataList', getRows())
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const handleRowDoubleClicked = (
    event: RowDoubleClickedEvent<CdrDataList>,
  ) => {
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    data: CdrDataList,
    rowIndex?: number,
  ) => {
    if (mode === 'create') {
      addRow(data)
    } else {
      updateRowByRowIndex(data, rowIndex)
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
    <div className="flex h-full w-full flex-col">
      {contextMenu && (
        <GridContextMenu
          {...contextMenu}
          onItemClick={handleContextMenuClick}
          onClick={() => setContextMenu(null)}
        />
      )}
      <Modal id="property-modal" title="CDR Data">
        <CdrDataListModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div className="flex h-full flex-col space-y-3 p-6">
        <div className="flex items-center justify-between space-y-3">
          <h3>CDR Data</h3>
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
            onCellContextMenu={onCellContextMenu}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    </div>
  )
}
